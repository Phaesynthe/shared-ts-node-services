import * as bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

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
}