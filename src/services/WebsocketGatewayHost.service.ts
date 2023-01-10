import { ServiceBase } from "./ServiceBase";

import WebSocket, { WebSocketServer } from 'ws';
import { generateRandomHex, waitForCondition} from "../utilities";
// import { IdentifyMessage } from "../Models";
// import { ClientMessageRouter, IdentityServiceMessageRouter } from "../MessageRouters";
// import {ContextualizedRouter} from "../Models/ContextualizedRouter";

export enum UniversalSocketEvents {
    Connect = 'connection',
    Error = 'error',
    Message = 'message'
}

export class WebsocketGatewayHostService extends ServiceBase {
    private peerServicePort: number;

    private peerServerGateway: WebSocketServer;

    public async startPeerServiceGateway(peerServicePort) {
        this.peerServicePort = peerServicePort;
        let peerServerStartupComplete = false;

        this.peerServerGateway = new WebSocketServer({ port: this.peerServicePort }, () => {
            peerServerStartupComplete = true;
        });

        await waitForCondition(() => {
            return peerServerStartupComplete === true;
        }, 10, 10);

        this.peerServerGateway.on(UniversalSocketEvents.Connect, this.handlePeerServerConnection);

        console.log(`WebSocket Server listening for Peer Servers on port ${this.peerServicePort}`);
    }

    // <editor-fold desc="Peer Service Generic Methods">
    private handlePeerServerConnection(socketConnection: WebSocket) {
        console.log('peer Service Connected!');
        console.log('Who could it be?');

        socketConnection.on(UniversalSocketEvents.Message, this.defaultPeerServiceRouter);
    };

    private defaultPeerServiceRouter(data: WebSocket.RawData) {
        console.log(data);
    }

    // </editor-fold>

}
