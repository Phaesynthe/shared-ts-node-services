import WebSocket from 'ws';
import { WebsocketEvent, WebsocketRouter } from './index';
export declare class WebsocketConnectionContainer {
    readonly id: string;
    private readonly _connection;
    get connection(): WebSocket;
    private messageRouters;
    errorRouter: (WebSocket: any) => void;
    constructor(connection: WebSocket, id: string);
    send(event: WebsocketEvent): void;
    setRouter(event: WebsocketEvent, router: WebsocketRouter): void;
}
