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



    }
    onClose(ws: WebSocket, code: number): void {
        
    }
    onError(Ws: WebSocket, error: Error): void {
        
    }


}

export default GameController;