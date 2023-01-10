import {generateRandomHex} from "../utilities";
import WebSocket from "ws";

export class SocketMessageBase {
    public command: string;
    public actionId: string;

    public payload?: object;

    constructor(command: string, payload?: object) {
        this.command = command;
    }

    toMessage(): Buffer {
        if (!this.actionId) {
            this.actionId = generateRandomHex();
        }
        return Buffer.from(JSON.stringify(this));
    }

    static fromMessage(data: WebSocket.RawData): SocketMessageBase {
        const raw = JSON.parse(data.toString());
        const socketMessage = new SocketMessageBase(raw.command);
        if (raw.actionId) {
            socketMessage.actionId = raw.actionId;
        }
        if (raw.payload) {
            socketMessage.payload = raw.payload;
        }
        return socketMessage
    }
}