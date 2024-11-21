import { MoveData } from "Logic/Game/Types";
import { ShipSetup } from "Logic/IGameSetup";

enum ServerMessages {
    SEARCH_STARTED = "search-started",
    GAME_FOUND = "game-found",
    OPPONENT_READY = "opponent-ready",
    GAME_STARTED = "game-started",
    GAME_UPDATE = "game-update",
    GAME_ENDED = "game-ended",
}

type ServerMessage = {
    serverTimestamp: number;
    serverMessage: string & ServerMessages;
}

type GameSetupMessage = ServerMessage & {
    gameSetup: ShipSetup;
}

type GameUpdateMessage = ServerMessage & {
    enemyMove: MoveData;
    wasHit: boolean;
    turn: number;
    isYourTurn: boolean;
}

type GameEndedMessage = {
    
}

