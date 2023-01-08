export * from './WebsocketConnectionContainer';

export * from './HttpMethodEnum';
export * from './HttpResponseCodeEnum';

export * from './SocketMessageBase';

export type WebsocketRouter = (WebSocket) => void;


export enum WebsocketEvent {
    Message= "message",
    Error = 'error',
    Ping = 'ping',
    Pong = 'pong',
    Open = 'open',
    Close = 'close',
    UnexpectedResponse = 'unexpected-response',
    Upgrade = 'upgrade'
}