import WsController from "Interfaces/IWsController";

import WebSocket, {Data} from "ws";


class GameController implements WsController {
    
    constructor() {
        
    }
    
    onConnection(ws: WebSocket): void {
        throw new Error("Method not implemented.");
    }
    onMessage(ws: WebSocket, message: WebSocket.Data): void {
        throw new Error("Method not implemented.");
    }
    onClose(ws: WebSocket, code: number): void {
        throw new Error("Method not implemented.");
    }
    onError(Ws: WebSocket, error: Error): void {
        throw new Error("Method not implemented.");
    }
}

export default GameController;