export * from './WebsocketConnectionContainer';

export type WebsocketRouter = (WebSocket) => void;

export enum HttpMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export enum ResponseCode {
    Ok = 200,
    Created = 201,
    Accepted = 202,
    Unauthorized = 401,
    PaymentRequired = 402,
    NotFound = 404,
    Unprocessable = 422,
    TooManyRequest = 429,
    NotImplemented= 501,
    ServiceUnavailable= 503
}

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