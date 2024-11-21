import { IWsController } from "Interfaces/IWsController";
import GameService from "Services/GameService";
import { WsAuthMiddleware } from "../Middleware/WsAuthMiddleware";
import WsSessionService from "Services/WsSessionService";

import WebSocket, {Data} from "ws";


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
    
    onConnection(ws: WebSocket): void {}

    onMessage(ws: WebSocket, data: WebSocket.Data): void {
        if(WsAuthMiddleware(this.wsSessionService, ws, data)) {
            return;
        }

        let message;

        try {
            message = this.convertDataToMessage(data);
        } catch (error) {
            ws.send("Message is not a valid JSON");
        }

        this.handleMessage(ws, message);
    }
    onClose(ws: WebSocket, code: number): void {}
    onError(Ws: WebSocket, error: Error): void {}

    private convertDataToMessage(data: WebSocket.Data) {
        return JSON.parse(data.toString());

    }
        
    private handleMessage(ws: WebSocket, message: string) {
        ws.
    }

}

export default GameController;