import { WebSocketWrapper } from "Logic/Interfaces/WebSocketWrapper";

export type Connection = {
    sessionKey?: string;
    wsw: WebSocketWrapper
}