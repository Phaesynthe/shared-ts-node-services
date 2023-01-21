export enum HttpResponseCode {
    Ok = 200,
    Created = 201,
    Accepted= 202,

    Unauthorized = 401,
    NotFound = 404,
    Conflict = 409,
    MethodNotAllowed = 405,
    UnprocessableEntity = 422,

    InternalError = 500,
    NotImplemented = 501
}

export enum ResponseErrorMessage {
    UnprocessableEntity = 'Invalid Record'
}