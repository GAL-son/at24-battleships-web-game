import { IWsController } from "Ws/Interfaces/IWsController";
import GameService from "Ws/Services/GameService";
import { WsAuthMiddleware } from "../Middleware/WsAuthMiddleware";
import WsSessionService from "Ws/Services/WsSessionService";

import WebSocket, {Data, WebSocketServer} from "ws";
import { WebSocketWrapper } from "Interfaces/WebSocketWrapper";
import { PlayerMessage, PlayerMessages, PlayerMoveMessage, SetShipsMessage} from "../Messages/Types/WsPlayerMessages";
import typia from "typia";
import UserRepository from "Global/Database/Repositories/UserRepository";
import IPlayer from "Interfaces/IPlayer";
import { Connection } from "Ws/Types/Connection";
import OnlinePlayer from "../OnlinePlayer";
import { ServerMessage } from "Ws/Messages/Types/WsServerMessages";
import { wsErrorHandler}  from "../WsErrorHandler";

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

        let message = JSON.parse(data.toString());
        this.handleMessage(wsw, message);
    }

    onClose(wsw: WebSocketWrapper, code: number): void {
        // DO ALL STUFF WHEN DISCONNECTED
        
        
        this.connections.delete(wsw.id);
    }

    onError(wsw: WebSocketWrapper, error: Error): void {
        wsErrorHandler(wsw.ws, error);
    }
        
    private handleMessage(wsw: WebSocketWrapper, message: any) {
        console.log(message);

        if(!typia.is<PlayerMessage>(message)) {
            wsErrorHandler(wsw.ws, "Not valid player message");
            return;
        }
        
        if(!this.connections.has(wsw.id)) {
            wsErrorHandler(wsw.ws, "unregistered connection");
            return;
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
                    if(!typia.is<SetShipsMessage>(pmessage)) {
                        wsErrorHandler(wsw.ws, "Invalid SetShipsMessage!")
                    }
                    const setShips = pmessage as SetShipsMessage;
                    this.handleSetShips(setShips, conn);
                    break;
                    case PlayerMessages.MOVE:
                    case PlayerMessages.SET_SHIPS:
                        if(!typia.is<PlayerMoveMessage>(pmessage)) {
                            wsErrorHandler(wsw.ws, "Invalid PlayerMoveMessage!")
                        }
                    const moveMessage = pmessage as PlayerMoveMessage;
                    this.handleMove(moveMessage, conn);
                    break;
                case PlayerMessages.QUIT_GAME:
                    wsw.ws.send("NOT IMPLEMENTED");
                    break;
                default:
                    wsErrorHandler(wsw.ws, "Invalid message type");
                    break;
            }
        }     
    }

    private async handleGameSearch(message: PlayerMessage, connection: Connection) {

        const session = this.wsSessionService.getSession(message.sessionKey);
        connection.sessionKey = session?.uuid;

        const userData = session?.session.data.user;
        console.log(userData);        

       try {
        if(session !== undefined && userData !== undefined) {
            const player = new OnlinePlayer(userData, connection.wsw.id, this.handleMessageSend);
            this.players.set(session?.uuid, player);
            this.gameService.addToQueue(player);
        }     
       } catch (error) {
        wsErrorHandler(connection.wsw.ws, error);
       }
    }

    private handleSetShips(message: SetShipsMessage, connection: Connection) {
        const player = this.getPlayer(connection);
        try {

            if(player === undefined) {
                throw(connection.wsw.ws, "Player not searching game")
            }

            this.gameService.setShips(player, message.ships);
        } catch (error) {
            wsErrorHandler(connection.wsw.ws, error);
        }
    }

    private handleMove(moveMessage: PlayerMoveMessage ,connection: Connection) {
        const player = this.getPlayer(connection);

        try {
            const move = moveMessage.move;

            if(player !== undefined) {
                this.gameService.playerMove(player, move);
            } else {
                throw new Error ("Player Not Found")
            }
        } catch (error) {
            wsErrorHandler(connection.wsw.ws, error);
        }
    }

    private handleQuit() {

    }

    private getPlayer(connection: Connection): IPlayer | undefined {
        try {
            if(connection.sessionKey === undefined) {
                throw new Error("Unregisterec donnection");
    
            };
    
            if(!this.players.has(connection.sessionKey)) {
                throw new Error("Has not joined the game");
            }
            
            const player = this.players.get(connection.sessionKey);
            if(player == undefined) {
                throw new Error("Player Not found");
            }

            return player;
        } catch (error) {
            wsErrorHandler(connection.wsw.ws, wsErrorHandler);
        }
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