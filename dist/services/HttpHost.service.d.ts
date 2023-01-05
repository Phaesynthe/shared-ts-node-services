import { ServiceBase } from "./ServiceBase";
import { HttpMethod } from "../models";
export declare class HttpHostService extends ServiceBase {
    private app;
    private readonly router;
    private server;
    private readonly origins;
    private readonly httpPort;
    constructor(httpPort: number, origins: string[]);
    private config;
    mountHandler(path: string, method: HttpMethod, handler: Promise<void>): void;
    start(): void;
    stop(): void;
}
