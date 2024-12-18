import { WebSocket } from "ws"

export type WebSocketWrapper = {
    ws: WebSocket,
    id: string;
}

