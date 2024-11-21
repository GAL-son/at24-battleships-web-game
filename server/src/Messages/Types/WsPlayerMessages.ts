import { MoveData, ShipPlacement } from "Logic/Game/Types";

enum PlayerMessages {
    START_SEARCH = "start-search",
    SET_SHIPS = "set-ships",
    MOVE = 'move',
    QUIT_GAME = "quit-game"
}

type GameSessionMessage = {
    uuid: string
}

type PlayerMessage = GameSessionMessage & {
    message: string & PlayerMessages;
    name: string;
}

type PlayerMoveMessage = PlayerMessage & {
    move: MoveData;
}

type SetShipsMessage = PlayerMessage & {
    ships: ShipPlacement[];
}




