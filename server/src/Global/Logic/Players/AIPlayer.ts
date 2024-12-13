import IPlayer from "Interfaces/IPlayer";
import typia from "typia";
import { ServerMessage, GameUpdateMessage, GameSetupMessage } from "Ws/Messages/Types/WsServerMessages";
import { MoveData, ShipPlacement } from "../Game/Types";
import { botShipSetups } from "Resources/BotShipSetups";
import { PlayerMessage, PlayerMessages, PlayerMoveMessage, SetShipsMessage } from "Ws/Messages/Types/WsPlayerMessages";
import { IGameSetup } from "Logic/IGameSetup";


export default class AIPlayer implements IPlayer {
    readonly MAX_SHIP_PLACEMENT_MISTAKES = 50;
    
    name: string;
    score: number;

    valueReady: boolean = false;
    static activeNames: string[];
    enemyBoard: {wasShot: boolean}[][] = [];
    boardSize: {x: number, y:number} = {x: 0, y: 0};
    hits: {x: number, y: number}[] = [];
    canMove = false;

    botHandler;
    constructor(botHandler: (bot: AIPlayer, message: PlayerMessage) => void) {
        this.botHandler = botHandler;

        this.name = "BOT";
        this.score = 9000;
    }

    sendMessage(message: ServerMessage): void {
        if(typia.is<GameSetupMessage>(message)) {
            const placements = this.setupShips(message.gameSetup);
            const botMessage: SetShipsMessage = {
                sessionKey: "",
                message: PlayerMessages.SET_SHIPS,
                ships: placements
            };


            this.botHandler(this, botMessage);
            this.valueReady = true;

        } else if(typia.is<GameUpdateMessage>(message)) {
            this.updateGameStatus(message);
            if(!this.canMove) {
                return;
            }
            const move: MoveData = this.calculateNextMove();
            const botMessage: PlayerMoveMessage = {
                sessionKey: "",
                message: PlayerMessages.MOVE,
                move: move
            };

            this.botHandler(this, botMessage);
        }
    }
    isReady(): boolean {
        return this.valueReady;
    }
    setReady(ready: boolean): void {
        this.valueReady = ready;
    }

    createBoard(boardSize: {x: number, y: number}) {
        this.boardSize = boardSize;
        for (let y = 0; y < boardSize.y; y++) {
            this.enemyBoard[y] = [];
            for (let x = 0; x < boardSize.x; x++) {
                this.enemyBoard[y][x] = {wasShot: false};
            }
        }
    }

    setupShips(gameSetup: IGameSetup): ShipPlacement[]{
        let shipPlacementMistakes: number = -1;

        const shipsPlacements: ShipPlacement[] = [];
        const sizes = Object.keys(gameSetup.shipSizes);

        sizes.forEach(size => {
            const sizeNum = parseInt(size);
            const count = gameSetup.shipSizes[sizeNum as keyof typeof gameSetup.shipSizes];

            for(let i = 0; i < count; i++) {
                let isShipCorrect = false;
                let placement: ShipPlacement = {
                    shipSize: sizeNum,
                    vertically: true,
                    position: {x: 0, y: 0}
                };

                while(!isShipCorrect) {
                    shipPlacementMistakes++;
                    if(shipPlacementMistakes > this.MAX_SHIP_PLACEMENT_MISTAKES) {
                        const preComputed = botShipSetups.get(gameSetup.shipSizes);

                        if(preComputed == null) {
                            throw new Error("No ship setup provided for given game setup: " + gameSetup.shipSizes);
                        }
                        const index = Math.floor(Math.random() * preComputed?.length)
                        return preComputed[index];
                    }

                    placement = this.generatePlacement(sizeNum, gameSetup.boardSize);

                    isShipCorrect = this.checkPlacement(placement, shipsPlacements) && this.isPlacementInBoard(placement, gameSetup.boardSize);
                }

                shipsPlacements.push(placement);
            }
        });

        return shipsPlacements;
    }

    generatePlacement(shipSize: number,boardSize: {x:number, y:number}): ShipPlacement {
        const vertically = (Math.random() > 0.5);
        const X = Math.floor(Math.random() * (boardSize.x - 1));
        const Y = Math.floor(Math.random() * (boardSize.y - 1));
        
        return {
            shipSize: shipSize,
            vertically: vertically,
            position: {x: X, y: Y}
        };
    }

    checkPlacement(newPlacemnt: ShipPlacement, placements: ShipPlacement[]): boolean {

        const newFields = this.getFieldsFromPlacement(newPlacemnt);

        placements.forEach(placement => {
            const fields = this.getFieldsFromPlacement(placement);
            const forbiddenFields: {x: number, y:number}[] = [];
            fields.forEach(field => {
                forbiddenFields.push(...this.getForbiddenFields(field));
            });

            if(forbiddenFields.some(r => newFields.includes(r))) {
                return false;
            }
        });
        return true;
    }

    updateGameStatus(message: GameUpdateMessage) {
        this.canMove = message.isYourTurn;
        const who = message.who;
        
        if(who == this.name) {
            const lastMove = message.move;
            if(message.wasHit) {
                this.hits.push(lastMove.moveCoordinates);
            }

            if(message.wasSunk && message.sunkenShip !== null) {
                

            }
        }
    }

    clearHits(sunken: {x: number, y: number}[]) {
        sunken.forEach(sukenPart => {
            const fieldsToDelete = [
                sukenPart,
                {x: sukenPart.x + 1, y: sukenPart.y},
                {x: sukenPart.x - 1, y: sukenPart.y},
                {x: sukenPart.x, y: sukenPart.y - 1},
                {x: sukenPart.x, y: sukenPart.y + 1},
            ]

            fieldsToDelete.forEach(fieldToDelete => {
                this.enemyBoard[fieldToDelete.x][fieldToDelete.y].wasShot = true;
                if(this.hits.findIndex(fieldToDelete, ))
            });
        });


    }

    calculateNextMove(): MoveData {
        if(this.hits.length > 0) {

        } else {
            const possibleMoves: {x: number, y: number}[] = [];

            if(this.hits.length> 0) {

            } else {
                for(let y = 0; y < this.boardSize.y; y++) {
                    for(let x = 0; x < this.boardSize.x; x++) {
                        if(!this.enemyBoard[x][y].wasShot) {
                            possibleMoves.push({x:x, y:y});
                        }
                    }
                }
            }

            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

            return {moveCoordinates: randomMove};
        }
    } 

    getFieldsFromPlacement(placement: ShipPlacement): {x: number, y:number}[] {
        const result: {x: number, y:number}[] = [];

        const startPlacement = placement.position;

        for(let i = 0; i < placement.shipSize; i++) {
            const field = {
                x: startPlacement.x + ((placement.vertically) ? 0 : 1) * i,
                y: startPlacement.y + ((placement.vertically) ? 1 :0) * i 
            };
            
            result.push(field);
        }

        return result;
    }

    getForbiddenFields(field: {x: number, y: number}): {x: number, y: number}[] {
        const result: {x: number, y: number}[] = [
            field,
            {x: field.x + 1, y: field.y},
            {x: field.x - 1, y: field.y},
            {x: field.x, y: field.y + 1},
            {x: field.x, y: field.y - 1}
        ]

        return result;
    } 

    isPlacementInBoard(placement: ShipPlacement, boardSize: {x:number, y:number}): boolean {
        return (placement.vertically && placement.position.y + placement.shipSize < boardSize.y) || 
            (placement.position.x + placement.shipSize < boardSize.x);
    }

}