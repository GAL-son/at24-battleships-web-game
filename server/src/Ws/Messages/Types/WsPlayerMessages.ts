import { MoveData, ShipPlacement } from "Global/Logic/Game/Types";
import { WsSessionMessage } from "./WsSessionMessage";

enum PlayerMessages {
    START_SEARCH = "start-search",
    SET_SHIPS = "set-ships",
    MOVE = 'move',
    QUIT_GAME = "quit-game"
}

enum GameType {
    SINGLEPLAYER = "singleplayer",
    MULTIPLAYER = "multiplayer"
}

type PlayerMessage = WsSessionMessage & {
    message: string & PlayerMessages;
}

type PlayerSearchGameMessage = PlayerMessage & {
    gameType: string & GameType,
}

type PlayerMoveMessage = PlayerMessage & {
    move: MoveData;
}

type SetShipsMessage = PlayerMessage & {
    ships: ShipPlacement[];
}

export {
    PlayerMessages,
    GameType,
    PlayerMessage,
    PlayerSearchGameMessage,
    PlayerMoveMessage,
    SetShipsMessage

}




