import { WebSocketWrapper } from "Interfaces/WebSocketWrapper";

export type Connection = {
    sessionKey?: string;
    wsw: WebSocketWrapper
}