import WebSocket, { WebSocketServer } from 'ws';
import { nextTick, waitForCondition } from '../utilities';
import { UniversalSocketEvents } from './WebsocketGatewayHost.service';
import {SocketMessageBase, WebsocketEvent} from '../models'
import { promisify } from 'util';

export class WebsocketConnection {
    private readonly _connection: WebSocket;
    public get connection() { return this._connection; }

    public outstandingRequests: Map<string, object | null>;

    private _messageRouter: Function;
    public set messageRouter(fn: Function) { this._messageRouter = fn; }

    constructor(connection: WebSocket) {
        this._connection = connection;

        this.configureRouter()
    }

    private configureRouter() {
        this._connection.on(WebsocketEvent.Message, this.handleMessage);
        this._connection.on(WebsocketEvent.Error, this.handleError);
        this._connection.on(WebsocketEvent.Close, this.handleClose);
    }

    public async send(command: string, payload: object | null, awaitResponse: boolean): Promise<void|object> {
        const socketMessage = new SocketMessageBase(command);
        if (payload) {
            socketMessage.payload = payload;
        }

        this._connection.send(Buffer.from(JSON.stringify(payload)));

        if (awaitResponse) {
            this.outstandingRequests.set(socketMessage.actionId, null);
            await waitForCondition(
                () => this.outstandingRequests.get(socketMessage.actionId) !== null,
                10,
                100
            );
            const responsePayload = this.outstandingRequests.get(socketMessage.actionId);
            this.outstandingRequests.delete(socketMessage.actionId);
            return responsePayload
        }
    }

    private handleMessage(data: WebSocket.RawData) {
        const socketMessage = SocketMessageBase.fromMessage(data);
        if (socketMessage.command === 'RESPONSE') {
            this.handleResponse(socketMessage);
        } else if (this._messageRouter) {
            this._messageRouter(socketMessage);
        }
    }

    private handleResponse(socketMessage: SocketMessageBase) {
        if (this.outstandingRequests.has(socketMessage.actionId)) {
            this.outstandingRequests.set(socketMessage.actionId, socketMessage.payload);
        }
    }

    private handleError(err: Error) {
        console.error(err);
    }

    private handleClose() {
        console.log('Close signal received.');
    }
}

export class WebSocketHostService {
    private readonly port: number;
    private socketServer: WebSocketServer;

    private socketConnections: WebsocketConnection[];

    constructor(port: number) {
        this.port = port;
        this.socketConnections = [];
    }

    public async start() {
        let startupComplete = false;

        this.socketServer = new WebSocketServer({ port: this.port }, () => {
            startupComplete = true;
        });

        await waitForCondition(() => {
            return startupComplete === true;
        }, 10, 10);

        this.socketServer.on(UniversalSocketEvents.Connect, this.handleConnection);
    }

    public async stop() {
        for ( const socketConnection of this.socketConnections) {
            socketConnection.connection.close();
        }
        // Allow our commands to get dispatched before continuing
        await nextTick();

        try {
            await promisify(this.socketServer.close);
        } catch (err) {
            console.error(err);
        }
    }

    private handleConnection(socketConnection: WebSocket) {
        console.log('peer Service Connected!');
        console.log('Who could it be?');

        this.socketConnections.push(new WebsocketConnection(socketConnection));
    }
}
