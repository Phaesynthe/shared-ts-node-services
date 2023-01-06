import WebSocket from 'ws';

import { WebsocketEvent, WebsocketRouter } from './index';

export class WebsocketConnectionContainer {
    public readonly id: string;
    private readonly _connection: WebSocket;
    public get connection() { return this._connection; }

    private messageRouters: Map<WebsocketEvent, WebsocketRouter>;

    public errorRouter: (WebSocket) => void;

    constructor(connection: WebSocket, id: string) {
        this.id = id;
        this._connection = connection;

        this.messageRouters = new Map();
        this.errorRouter = () => {};
    }

    public send(event: WebsocketEvent) {
        this._connection.send(event);
    }

    public setRouter(event: WebsocketEvent, router: WebsocketRouter) {
        if (!this.connection) {
            throw new Error('Attempt to mount router when no connection is present');
        }
        // If there is a router for the event, remove it from the connection
        const oldRouter = this.messageRouters.get(event);
        if (oldRouter) {
            console.log(`Removing message router for: ${event}`);
            this.connection.removeListener(event, oldRouter);
        }

        // Now, set the listener and retain the router
        this.connection.on(event, router);
        this.messageRouters.set(event, router);
        console.log(`Set message router for: ${event}`);
    }
}