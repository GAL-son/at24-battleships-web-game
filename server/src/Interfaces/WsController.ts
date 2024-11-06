import WebSocket = require("ws");

interface WsController {
    onConnection: (ws: WebSocket) => void;
    onMessage: (message: WebSocket.Data) => void;
    onClose: (code: number) => void;
    onError: (Ws: WebSocket, error: Error) => void;
}

export default WsController;