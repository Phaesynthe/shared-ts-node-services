import { ServiceBase} from "./ServiceBase";

import { WebsocketConnectionContainer, WebsocketEvent, WebsocketRouter } from '../models';

import WebSocket from 'ws';
import { waitForCondition } from "../utilities";

// We keep these as numbers to avoid string matching speed reductions
export enum MicroserviceConnection {
    Gateway,
    Identity,
    User
}

export class WebsocketMicroserviceClientService extends ServiceBase {
    // We will assume one connection per type for now.
    // In the future, it would be wise to allow multiple connections where any outbound communication selects one in
    // a round-robin pattern to distribute load.
    private connections: Map<MicroserviceConnection, WebsocketConnectionContainer>;

    constructor() {
        super();
        this.connections = new Map();
    }

    public async connect(connectionType: MicroserviceConnection, uri: string): Promise<WebsocketConnectionContainer> {
        let wsClient: WebSocket;
        let encounteredError: boolean = false;
        try {
            wsClient = new WebSocket(uri);
            wsClient.on(WebsocketEvent.Error, this.defaultErrorHandler);
        } catch (err) {
            encounteredError = true;
        }

        let connected = false;
        const tempConnectionHandler: WebsocketRouter = () => {
            connected = true;
        };
        wsClient.on(WebsocketEvent.Open, tempConnectionHandler);

        const connectionContainer: WebsocketConnectionContainer = new WebsocketConnectionContainer(wsClient, connectionType.toString());

        await waitForCondition(
            () => connected,
            10,
            100,
            () => encounteredError
        );
        wsClient.removeListener(WebsocketEvent.Open, tempConnectionHandler);

        this.connections.set(connectionType, connectionContainer);
        console.log(`Established socket connection to: ${uri}`)

        return connectionContainer;
    }

    public getConnection(connectionType: MicroserviceConnection): WebsocketConnectionContainer {
        return this.connections.get(connectionType);
    }

    private defaultErrorHandler(data) {
        console.error(data);
        throw new Error('WebSocket Default Errorhandler invoked! See Log for output');
    }
}