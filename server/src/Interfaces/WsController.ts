import WebSocket from 'ws';

interface WsController {
    onConnection(ws: WebSocket): void;
    onMessage(ws: WebSocket, message: WebSocket.Data): void;
    onClose(ws: WebSocket, code: number): void;
    onError(Ws: WebSocket, error: Error): void;
}

export default WsController;