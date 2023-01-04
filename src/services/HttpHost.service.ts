import {ServiceBase} from "./ServiceBase";
// import {Config} from "./Config";

import * as bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import {HttpMethod} from "../models";

export class HttpHostService extends ServiceBase {
    private app: express.Application;
    private readonly router: express.Router;
    private server: express.Server;
    private readonly origins: string[];
    private readonly httpPort: number;

    constructor (httpPort: number, origins: string[]) {
        super();
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

    public mountHandler(path: string, method: HttpMethod, handler: Promise<void>) {
        switch (method) {
            case HttpMethod.Get:
                this.router.get(path, handler);
                break;
            case HttpMethod.Patch:
                this.router.patch(path, handler);
                break;
            case HttpMethod.Post:
                this.router.post(path, handler);
                break;
            case HttpMethod.Put:
                this.router.put(path, handler);
                break;
            case HttpMethod.Delete:
                this.router.delete(path, handler);
                break;
            default:
                console.error(`Attempt to mount route with an unknown method: ${method} ${path}`);
                break;
        }
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
}