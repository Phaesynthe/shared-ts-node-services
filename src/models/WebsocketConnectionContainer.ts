import WebSocket from "ws";

import {WebsocketEvent, WebsocketRouter} from './index';

export class WebsocketConnectionContainer {
    public readonly id: string;
    private readonly connection: WebSocket;
    private messageRouters: Map<WebsocketEvent, WebsocketRouter>;

    public errorRouter: (WebSocket) => void;

    constructor(connection: WebSocket, id: string) {
        this.id = id;
        this.connection = connection;
    }

    public setRouter(event: WebsocketEvent, router: WebsocketRouter) {
        if (!this.connection) {
            throw new Error('Attempt to mount router when no connection is present');
        }
        // If there is a router for the event, remove it from the connection
        if (this.messageRouters.get(event)) {
            console.log(`Removing message router for: ${event}`);
            this.connection.removeListener(event, this.messageRouters.get(event));
        }

        // Now, set the listener and retain the router
        this.connection.on(event, router);
        this.messageRouters.set(event, router);
        console.log(`Set message router for: ${event}`);
    }
}