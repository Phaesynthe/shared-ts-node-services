import { ServiceBase } from "./ServiceBase";
export declare enum UniversalSocketEvents {
    Connect = "connection",
    Error = "error",
    Message = "message"
}
export declare class WebsocketGatewayHostService extends ServiceBase {
    private peerServicePort;
    private peerServerGateway;
    startPeerServiceGateway(peerServicePort: any): Promise<void>;
    private handlePeerServerConnection;
    private defaultPeerServiceRouter;
}
