export * from './WebsocketConnectionContainer';
export declare type WebsocketRouter = (WebSocket: any) => void;
export declare enum HttpMethod {
    Delete = "DELETE",
    Get = "GET",
    Patch = "PATCH",
    Post = "POST",
    Put = "PUT"
}
export declare enum ResponseCode {
    Ok = 200,
    Created = 201,
    Accepted = 202,
    Unauthorized = 401,
    PaymentRequired = 402,
    NotFound = 404,
    Unprocessable = 422,
    TooManyRequest = 429,
    NotImplemented = 501,
    ServiceUnavailable = 503
}
export declare enum WebsocketEvent {
    Message = "message",
    Error = "error",
    Ping = "ping",
    Pong = "pong",
    Open = "open",
    Close = "close",
    UnexpectedResponse = "unexpected-response",
    Upgrade = "upgrade"
}
