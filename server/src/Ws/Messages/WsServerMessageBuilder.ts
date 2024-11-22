import { ShipSetup } from "Logic/IGameSetup";
import { GameEndReason, ServerMessage, ServerMessages } from "./Types/WsServerMessages";
import { MoveData } from "Global/Logic/Game/Types";


export default class WsServerMessageBuilder {
    public static createGenericServerMessage(message: ServerMessages) {
        return {
            serverMessage: message,
            serverTimestamp: Date.now()
        } as ServerMessage
    }

    public static createGameSetupMessage(gameSetup: ShipSetup, opponent: {name: string; score: number;}) {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_FOUND),
            gameSetup: gameSetup,
            opponent: opponent
        }
    }

    public static createGameUpdateMessage(enemyMove: MoveData, wasHit: boolean, turn: number, isYourTurn: boolean) {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_UPDATE),
            enemyMove: enemyMove,
            wasHit: wasHit,
            turn: turn,
            isYourTurn: isYourTurn
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