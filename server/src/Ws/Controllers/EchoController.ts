import WebSocket, { WebSocketServer } from "ws";

import {IWsController} from "Ws/Interfaces/IWsController";
import { WebSocketWrapper } from "Interfaces/WebSocketWrapper";

class EchoController implements IWsController {

    constructor() {
    }

    onConnection(wsw: WebSocketWrapper): void {
        const echo = "Connected on :" + wsw.id; 
        console.log(echo);
        wsw.ws.send(echo);
    }
    onMessage(wsw: WebSocketWrapper, message: WebSocket.Data): void {
        const echo = "Message: " + message + " on connID: " + wsw.id;
        console.log(echo);
        wsw.ws.send("Echo: " + echo);
    }
    onClose(wsw: WebSocketWrapper, code: number): void {
        const echo = "Connection closed on connID: " + wsw.id;
        wsw.ws.send(echo);
        console.log(echo);
    }
    onError(wsw: WebSocketWrapper, error: Error): void {
        const echo = "Connection Error " + error.message + " on connID " + wsw.id;
        wsw.ws.send(echo);  
    }
}

export default EchoController;