import { ServiceBase } from "./ServiceBase";
import { WebsocketConnectionContainer } from '../models';
export declare enum MicroserviceConnection {
    Gateway = 0,
    Identity = 1,
    User = 2
}
export declare class WebsocketMicroserviceClientService extends ServiceBase {
    private connections;
    constructor();
    connect(connectionType: MicroserviceConnection, uri: string): Promise<WebsocketConnectionContainer>;
    getConnection(connectionType: MicroserviceConnection): WebsocketConnectionContainer;
    private defaultErrorHandler;
}
