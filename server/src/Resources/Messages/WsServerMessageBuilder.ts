import { IGameSetup, ShipSetup } from "Logic/IGameSetup";
import { GameEndReason, GameSetupMessage, GameStartMessage, GameUpdateMessage, ServerMessage, ServerMessages } from "./Types/WsServerMessages";
import { MoveData } from "Logic/Game/Types";


class WsServerMessageBuilder {
    public static createGenericServerMessage(message: ServerMessages) {
        return {
            serverMessage: message,
            serverTimestamp: Date.now()
        } as ServerMessage
    }

    public static createGameSetupMessage(gameSetup: IGameSetup, opponent: {name: string; score: number;}): GameSetupMessage {
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
        who:string,
        isYourTurn: boolean,
        sunkenShip: {x: number, y:number}[] | null
    ): GameUpdateMessage {
        return {
            ... this.createGenericServerMessage(ServerMessages.GAME_UPDATE),
            enemyMove: enemyMove,
            wasHit: wasHit,
            wasSunk: wasSunk,
            turn: turn,
            who: who,
            isYourTurn: isYourTurn,
            sunkenShip: sunkenShip
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