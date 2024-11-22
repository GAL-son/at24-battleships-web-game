import { ShipSetup } from "Logic/IGameSetup";
import { GameEndReason, GameSetupMessage, GameStartMessage, ServerMessage, ServerMessages } from "./Types/WsServerMessages";
import { MoveData } from "Global/Logic/Game/Types";


class WsServerMessageBuilder {
    public static createGenericServerMessage(message: ServerMessages) {
        return {
            serverMessage: message,
            serverTimestamp: Date.now()
        } as ServerMessage
    }

    public static createGameSetupMessage(gameSetup: ShipSetup, opponent: {name: string; score: number;}): GameSetupMessage {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_FOUND),
            gameSetup: gameSetup,
            opponent: opponent
        }
    }

    public static createGameStartMessage(isYourTurn: boolean) : GameStartMessage {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_STARTED),
            isYourTurn: isYourTurn
        }
    }

    public static createGameUpdateMessage(
        enemyMove: MoveData, 
        wasHit: boolean,
        wasSunk: boolean, 
        turn: number, 
    ) {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_UPDATE),
            enemyMove: enemyMove,
            wasHit: wasHit,
            wasSunk: wasSunk,
            turn: turn,
        }
    }

    public static createGameEndedMessage(didYouWon: boolean, totalTurns: number, scoreChange: number, reason: GameEndReason) {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_ENDED),
            didYouWon: didYouWon,
            totalTurns: totalTurns,
            scoreChange: scoreChange,
            reason: reason
        }
    }
}

export default WsServerMessageBuilder;