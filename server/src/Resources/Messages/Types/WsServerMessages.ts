import { MoveData } from "Logic/Game/Types";
import { IGameSetup, ShipSetup } from "Logic/IGameSetup";

enum ServerMessages {
    SEARCH_STARTED = "search-started",
    GAME_FOUND = "game-found",
    OPPONENT_READY = "opponent-ready",
    GAME_STARTED = "game-started",
    GAME_UPDATE = "game-update",
    GAME_ENDED = "game-ended",
}

enum GameEndReason {
    SHIPS_DESTROYES = 'ships-destroyed',
    FORFIET = "forfeit"
} 

type ServerMessage = {
    serverTimestamp: number;
    serverMessage: string & ServerMessages;
}

type GameSetupMessage = ServerMessage & {
    gameSetup: IGameSetup;
    opponent: {
        name: string;
        score: number;
    }
}

type GameStartMessage = ServerMessage & {
    isYourTurn: boolean;
}

type GameUpdateMessage = ServerMessage & {
    enemyMove: MoveData;
    wasHit: boolean;
    wasSunk: boolean;
    turn: number;
    who: string,
    isYourTurn: boolean;
    sunkenShip: {x: number, y:number}[] | null;
}

type GameEndedMessage = {
    didYouWon: boolean;
    totalTurns: number;
    scoreChange: number;
    reason: GameEndReason;
}

export {
    ServerMessages,
    GameEndReason,
    ServerMessage,
    GameSetupMessage,
    GameUpdateMessage,
    GameEndedMessage,
    GameStartMessage
}

