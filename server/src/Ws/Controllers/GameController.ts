import { IWsController } from "Ws/Interfaces/IWsController";
import GameService from "Ws/Services/GameService";
import { WsAuthMiddleware } from "../Middleware/WsAuthMiddleware";
import WsSessionService from "Ws/Services/WsSessionService";

import WebSocket, {Data, WebSocketServer} from "ws";
import { WebSocketWrapper } from "Interfaces/WebSocketWrapper";
import { PlayerMessage, PlayerMessages, SetShipsMessage} from "../Messages/Types/WsPlayerMessages";
import typia from "typia";
import UserRepository from "Global/Database/Repositories/UserRepository";
import IPlayer from "Interfaces/IPlayer";
import { Connection } from "Ws/Types/Connection";
import OnlinePlayer from "../OnlinePlayer";
import { ServerMessage } from "Ws/Messages/Types/WsServerMessages";

class GameController implements IWsController {
    connections: Map<string, Connection> = new Map(); // Key is ws id
    players: Map<string, IPlayer> = new Map(); // key is session key

    gameService: GameService;
    wsSessionService: WsSessionService;

    userRepository: UserRepository;

    constructor(
        gameService: GameService,
        wsSessionService: WsSessionService,
        userRepository: UserRepository
    ) {
        this.gameService = gameService;
        this.wsSessionService = wsSessionService;
        this.userRepository = userRepository;
    }
    
    onConnection(wsw: WebSocketWrapper): void {
        this.connections.set(wsw.id, {sessionKey: undefined, wsw});
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

        this.handleMessage(wsw, message);
    }
    onClose(wsw: WebSocketWrapper, code: number): void {
        // DO ALL STUFF WHEN DISCONNECTED
        
        
        this.connections.delete(wsw.id);
    }

    onError(wsw: WebSocketWrapper, error: Error): void {
        wsw.ws.send("ERROR" + error.message);
    }

    private convertDataToMessage(data: WebSocket.Data): any {
        return JSON.parse(data.toString());

    }
        
    private handleMessage(wsw: WebSocketWrapper, message: any) {
        console.log(message);

        if(!typia.is<PlayerMessage>(message)) {
            wsw.ws.send("Not valid player message");
        }

        if(!this.connections.has(wsw.id)) {
            throw new Error("Unregistered connection");
        }

        const conn = this.connections.get(wsw.id);
        if(conn !== undefined && !this.isConnectionAttachedToSession(conn)) {
            this.attachConnectionToSession(conn, message.sessionKey);
        }

        if(conn !== undefined) {
            const pmessage = message as PlayerMessage;
            switch (pmessage.message) {
                case PlayerMessages.START_SEARCH:
                    this.handleGameSearch(pmessage, conn);
                    break;
                case PlayerMessages.SET_SHIPS:
                    const setShips = pmessage as SetShipsMessage;
                    this.handleSetShips(setShips, conn);
                    break;
                case PlayerMessages.MOVE:
                case PlayerMessages.QUIT_GAME:
                    wsw.ws.send("NOT IMPLEMENTED");
                    break;
                default:
                    wsw.ws.send("Invalid message type");
                    break;
            }
        }     
    }

    private async handleGameSearch(message: PlayerMessage, connection: Connection) {

        const session = this.wsSessionService.getSession(message.sessionKey);
        connection.sessionKey = session?.uuid;

        const userData = session?.session.data.user;
        console.log(userData);        

        if(session !== undefined) {
            const player = new OnlinePlayer(userData, connection.wsw.id, this.handleMessageSend);
            this.players.set(session?.uuid, player);
            this.gameService.addToQueue(player);
        }       
    }

    private handleSetShips(message: SetShipsMessage, connection: Connection) {
        
    }

    private handleMove() {

    }

    private handleQuit() {

    }

    

    private getUserForConnection(connectionId: string) {
        const connection = this.connections.get(connectionId);
        if(connection == undefined) {
            return false;
        }

        if(connection.sessionKey == undefined) {
            return false;
        }


    }

    isConnectionAttachedToSession(connection: Connection | undefined) {
        if(connection === undefined) {
            return false;
        }        
        
        return connection.sessionKey !== undefined;
    }

    attachConnectionToSession(connection: Connection, sessionKey: string) {
        connection.sessionKey = sessionKey;

        this.connections.set(connection.wsw.id, connection);
    }

    handleMessageSend = (connectionId: string, message: ServerMessage) => {
        const conn = this.connections.get(connectionId);

        if(conn !== undefined) {
            conn.wsw.ws.send(JSON.stringify(message));
        }
    }

}

export default GameController;