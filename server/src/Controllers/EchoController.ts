import WebSocket from "ws";

import WsController from "Interfaces/WsController";

class EchoController implements WsController {
    onConnection(ws: WebSocket): void {
        console.log("Connected");
        ws.send("Connected");
    }
    onMessage(ws: WebSocket, message: WebSocket.Data): void {
        console.log("Message: " + message);
        ws.send("Echo: " + message);
    }
    onClose(ws: WebSocket, code: number): void {
        console.log("Connection closed")
    }
    onError(Ws: WebSocket, error: Error): void {
        console.error("Connection Error")
    }
}

export default EchoController;