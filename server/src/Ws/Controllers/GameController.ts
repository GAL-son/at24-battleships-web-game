import { IWsController } from "Ws/Interfaces/IWsController";
import GameService from "Global/Services/GameService";
import { WsAuthMiddleware } from "../Middleware/WsAuthMiddleware";
import WsSessionService from "Global/Services/WsSessionService";

import WebSocket, {Data, WebSocketServer} from "ws";
import { WebSocketWrapper } from "Interfaces/WebSocketWrapper";


class GameController implements IWsController {
    gameService: GameService;
    wsSessionService: WsSessionService;

    constructor(
        gameService: GameService,
        wsSessionService: WsSessionService
    ) {
        this.gameService = gameService;
        this.wsSessionService = wsSessionService;
    }
    
    onConnection(wsw: WebSocketWrapper): void {

    }

    onMessage(wsw: WebSocketWrapper, data: WebSocket.Data): void {
        if(WsAuthMiddleware(this.wsSessionService, wsw.ws, data)) {
            return;
        }

        let message;

        try {
            message = this.convertDataToMessage(data);
        } catch (error) {
            wsw.ws.send("Message is not a valid JSON");
        }

        this.handleMessage(wsw.ws, message);
    }
    onClose(wsw: WebSocketWrapper, code: number): void {}
    onError(wsw: WebSocketWrapper, error: Error): void {}

    private convertDataToMessage(data: WebSocket.Data) {
        return JSON.parse(data.toString());

    }
        
    private handleMessage(ws: WebSocket, message: string) {
    }

}

export default GameController;