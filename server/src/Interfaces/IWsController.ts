import WebSocket from 'ws';

export interface IWsController {
    onConnection(ws: WebSocket): void;
    onMessage(ws: WebSocket, message: WebSocket.Data): void;
    onClose(ws: WebSocket, code: number): void;
    onError(Ws: WebSocket, error: Error): void;
}