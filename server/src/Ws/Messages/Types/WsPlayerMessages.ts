import { MoveData, ShipPlacement } from "Global/Logic/Game/Types";
import { WsSessionMessage } from "./WsSessionMessage";

enum PlayerMessages {
    START_SEARCH = "start-search",
    SET_SHIPS = "set-ships",
    MOVE = 'move',
    QUIT_GAME = "quit-game"
}

type PlayerMessage = WsSessionMessage & {
    message: string & PlayerMessages;
}

type PlayerMoveMessage = PlayerMessage & {
    move: MoveData;
}

type SetShipsMessage = PlayerMessage & {
    ships: ShipPlacement[];
}

export {
    PlayerMessages,
    PlayerMessage,
    PlayerMoveMessage,
    SetShipsMessage
}




