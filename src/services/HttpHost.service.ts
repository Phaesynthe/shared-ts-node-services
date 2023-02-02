import * as bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import {HttpMethod} from "../models";

export class HttpHostService {
    private app: express.Application;
    public readonly router: express.Router;
    private server: express.Server;
    private readonly origins: string[];
    private readonly httpPort: number;

    constructor (httpPort: number, origins: string[] = []) {
        this.app = express();
        this.router = express.Router();
        this.httpPort = httpPort;
        this.origins = origins;

        this.config();
    }

    private config(): void {
        this.app.use(cors({ origin: this.origins.join(',')}));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        // Api Routes
        this.app.use('/', this.router);
    }

    public start() {
        this.server = this.app.listen(this.httpPort, async () => {
            console.log(`HTTP server listening on port ${this.httpPort}!\n`);
        });
    }

    public stop() {
        if (this.server) {
            this.server.close();
        }
    }

    public mountRoutes(router, routeDefs): void {
        let methodFormatted: string;
        for (const routeDef of routeDefs) {
            switch (routeDef.method) {
                case HttpMethod.Delete:
                    router.delete(routeDef.uri, routeDef.handler);
                    methodFormatted = routeDef.method.padEnd(10);
                    break;
                case HttpMethod.Get:
                    router.get(routeDef.uri, routeDef.handler);
                    methodFormatted = routeDef.method.padEnd(10);
                    break;
                case HttpMethod.Patch:
                    router.patch(routeDef.uri, routeDef.handler);
                    methodFormatted = routeDef.method.padEnd(10);
                    break;
                case HttpMethod.Post:
                    router.post(routeDef.uri, routeDef.handler);
                    methodFormatted = routeDef.method.padEnd(10);
                    break;
                default:
                    console.error(`Unmapped Method: ${routeDef.method}`)
                    break;
            }
            console.log(`Mounted: ${methodFormatted} ${routeDef.uri}`);
        }
    }
}