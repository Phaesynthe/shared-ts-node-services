import {HttpMethod} from "./HttpMethodEnum";

export interface IHttpRouteDefinition {
    uri: string;
    method: HttpMethod;
    handler: Function;
}