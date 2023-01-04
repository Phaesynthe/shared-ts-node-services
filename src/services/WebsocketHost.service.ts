// import { promisify as Promisify } from 'util'

import {ServiceBase} from "./ServiceBase";
// import {Config} from "./Config";

import WebSocket, { WebSocketServer } from 'ws';
import { generateRandomHexId, waitForCondition} from "../utilities";
import { IdentifyMessage } from "../Models";
import { ClientMessageRouter, IdentityServiceMessageRouter } from "../MessageRouters";
import {ContextualizedRouter} from "../Models/ContextualizedRouter";

export enum UniversalSocketEvents {
    Connect = 'connection',
    Error = 'error',
    Message = 'message'
}

export class WebsocketHostService extends ServiceBase {
    private clientGateway: WebSocketServer;
    private peerServerGateway: WebSocketServer;

    private clientConnectionPool: Map<string, ContextualizedRouter>;
    private clientConnectionsPendingIdentification: Map<string, ContextualizedRouter>;

    private identityServices: Map<string, WebSocket>;
    private identityServiceIds: Set<string>;

    constructor () {
        super();
        this.clientConnectionPool = new Map();
        this.clientConnectionsPendingIdentification = new Map();

        this.identityServices = new Map();
        this.identityServiceIds = new Set();
    }

    private config(): void {
        this.clientGateway.on(UniversalSocketEvents.Connect, this.handleClientConnection);
        this.peerServerGateway.on(UniversalSocketEvents.Connect, this.handlePeerServerConnection);
    }

    public async start() {
        let clientStartupComplete = false;
        let peerServerStartupComplete = false;
        this.clientGateway = new WebSocketServer({ port: Config.instance().clientGatewaySocketPort }, () => {
            clientStartupComplete = true;
        });
        this.peerServerGateway = new WebSocketServer({ port: Config.instance().peerServerSocketPort }, () => {
            peerServerStartupComplete = true;
        });
        this.config();
        await waitForCondition(() => {
            return clientStartupComplete === true && peerServerStartupComplete === true;
        }, 50);

        console.log(`WebSocket Server listening for Clients on port ${Config.instance().clientGatewaySocketPort}`);
        console.log(`WebSocket Server listening for Peer Servers on port ${Config.instance().peerServerSocketPort}`);
    }

    public async stop() {
        let shutDownClientConnections = false;
        let shutDownPeerConnections = false;

        this.clientGateway.close((err) => {
            if (err) {
                console.error(err);
            }
            shutDownClientConnections = true;
        });

        this.peerServerGateway.close((err) => {
            if (err) {
                console.error(err);
            }
            shutDownPeerConnections = true;
        });

        await waitForCondition(() => {
            return shutDownClientConnections === true && shutDownPeerConnections === true;
            }, 50);
    }

    // <editor-fold desc="Client Connection Methods">

    private handleClientConnection(socketConnection: WebSocket) {
        const tempConnectionId = generateRandomHexId();

        const routerWrapper = new ContextualizedRouter(
            socketConnection,
            UniversalSocketEvents.Message,
            tempConnectionId,
            ClientMessageRouter.preIdentificationRouter
        );

        this.clientConnectionsPendingIdentification.set(tempConnectionId, routerWrapper);
    }

    public sendClientMessage(clientId: string, payload) {
        const contextualizedRouter = this.clientConnectionPool.get(clientId);
        contextualizedRouter.connection.send(payload);
    }

    public acceptPendingClientIdentification(tempConnectionId: string, userId: string) {
        const routerWrapper = this.clientConnectionsPendingIdentification.get(tempConnectionId);

        // Unset the current message listener
        routerWrapper.unRoute();

        // Remove the connection from the pending map
        this.clientConnectionsPendingIdentification.delete(tempConnectionId);

        const identifiedRouterWrapper = new ContextualizedRouter(
            routerWrapper.connection,
            UniversalSocketEvents.Message,
            tempConnectionId,
            ClientMessageRouter.messageRouter
        );

        // Add it to the identified map
        this.clientConnectionPool.set(userId, identifiedRouterWrapper);
    }

    public rejectPendingClientIdentification(tempConnectionId: string) {
        const contextualizedRouter = this.clientConnectionsPendingIdentification.get(tempConnectionId);
        contextualizedRouter.connection.close(404, 'Identification Rejected');
        this.clientConnectionsPendingIdentification.delete(tempConnectionId);
    }

    // </editor-fold>

    // <editor-fold desc="Peer Service Generic Methods">
    private handlePeerServerConnection(socketConnection: WebSocket) {
        // Detect the peer type
        // this is an example using the identityService
        socketConnection.on(UniversalSocketEvents.Message, IdentityServiceMessageRouter.messageRouter);
        // this.identityServiceIds.add()
    };

    private handlePeerServiceIdentify() {

    }
    // </editor-fold>

    // <editor-fold desc="Identity Service Methods">
    private handleClientIdentification(data: WebSocket.RawData) {
        const stringData = data.toString();

        const command = stringData.slice(0, 25);

        if (command === 'IDENTIFY'.padEnd(25)) {
            const idMessage: IdentifyMessage = new IdentifyMessage(stringData.slice(26));
            console.log(idMessage.value);

            // Retain the connection
            const tempConnectionId = generateRandomHexId();

            // Call the identity service
        }
    }

    public sendIdentityServiceMessage(serverType: string, ) {
        // this.identityServices
    }
    // </editor-fold>

}
