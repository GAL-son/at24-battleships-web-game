import IPlayer from "Interfaces/IPlayer";
import typia from "typia";
import { ServerMessage, GameUpdateMessage, GameSetupMessage, ServerMessages, GameStartMessage } from "../../../Ws/Messages/Types/WsServerMessages";
import { MoveData, ShipPlacement } from "../Game/Types";
import { botShipSetups } from "../../../Resources/BotShipSetups";
import { PlayerMessage, PlayerMessages, PlayerMoveMessage, SetShipsMessage } from "../../../Ws/Messages/Types/WsPlayerMessages";
import { IGameSetup } from "Logic/IGameSetup";
import { isArray } from "util";


export default class AIPlayer implements IPlayer {
    readonly MAX_SHIP_PLACEMENT_MISTAKES = 30;

    name: string;
    score: number;

    valueReady: boolean = false;
    static activeNames: string[];
    enemyBoard: { wasShot: boolean }[][] = [];
    boardSize: { x: number, y: number } = { x: 0, y: 0 };
    hits: { x: number, y: number }[] = [];
    canMove = false;
    static botNumber = 0;

    botHandler;
    constructor(botHandler: (bot: AIPlayer, message: PlayerMessage) => void) {
        this.botHandler = botHandler;

        this.name = "BOT" + (AIPlayer.botNumber++);
        this.score = 9000;
    }

    sendMessage(message: ServerMessage): void {
        // console.log("BOT MESSAGAE");
        // console.log(message);
        switch (message.serverMessage) {
            case ServerMessages.GAME_FOUND:
                // console.log("GAME FOUND");                
                if (this.valueReady) {
                    return;
                }
                const setup = message as GameSetupMessage
                this.createBoard(setup.gameSetup.boardSize);
                this.sendPlacementMessage((setup.gameSetup))
                break;
            case ServerMessages.GAME_STARTED:
                const start = message as GameStartMessage;
                if (start.isYourTurn) {
                    setTimeout(() => {
                        this.sendMoveMessage();
                    }, 1000);
                }
                break;
            case ServerMessages.GAME_UPDATE:
                console.log("UPDATE");
                this.updateGameStatus(message as GameUpdateMessage);
                if (this.canMove) {
                    this.testDrawBoard();
                    setTimeout(() => {
                        this.sendMoveMessage();
                    }, 1000);
                }
                break;
        }
    }
    isReady(): boolean {
        return this.valueReady;
    }
    setReady(ready: boolean): void {
        this.valueReady = ready;
    }

    sendMoveMessage() {
        const move: MoveData = this.calculateNextMove();
        const botMessage: PlayerMoveMessage = {
            sessionKey: "",
            message: PlayerMessages.MOVE,
            move: move
        };

        this.botHandler(this, botMessage);
    }

    sendPlacementMessage(gameSetup: IGameSetup) {
        // console.log("SEND MSG");

        const placements = this.setupShips(gameSetup);
        // console.log("FINAL PLACEMNTS");
        // console.log(placements);

        const botMessage: SetShipsMessage = {
            sessionKey: "",
            message: PlayerMessages.SET_SHIPS,
            ships: placements
        };

        this.botHandler(this, botMessage);
        this.valueReady = true;
    }


    createBoard(boardSize: { x: number, y: number }) {
        this.boardSize = boardSize;
        for (let y = 0; y < boardSize.y; y++) {
            this.enemyBoard[y] = [];
            for (let x = 0; x < boardSize.x; x++) {
                this.enemyBoard[y][x] = { wasShot: false };
            }
        }

        this.testDrawBoard();
    }

    setupShips(gameSetup: IGameSetup): ShipPlacement[] {
        // console.log("SETBOT " + this.name + " - " + this.valueReady);

        let shipPlacementMistakes: number = -1;

        const shipsPlacements: ShipPlacement[] = [];
        const sizes = Object.keys(gameSetup.shipSizes).reverse();

        sizes.forEach(size => {
            const sizeNum = parseInt(size);
            const count = gameSetup.shipSizes[sizeNum as keyof typeof gameSetup.shipSizes];

            for (let i = 0; i < count; i++) {
                let isShipCorrect = false;
                let placement: ShipPlacement = {
                    shipSize: sizeNum,
                    vertically: true,
                    position: { x: 0, y: 0 }
                };

                while (!isShipCorrect) {
                    // console.log(shipPlacementMistakes);

                    shipPlacementMistakes++;
                    if (shipPlacementMistakes > this.MAX_SHIP_PLACEMENT_MISTAKES) {
                        console.log(" USE PRECOMPUTED ");

                        const preComputed = botShipSetups.get(gameSetup.shipSizes);

                        if (preComputed == null) {
                            throw new Error("No ship setup provided for given game setup: " + gameSetup.shipSizes);
                        }
                        const index = Math.floor(Math.random() * preComputed?.length)
                        // console.log(preComputed[index]);
                        shipsPlacements.splice(0, shipsPlacements.length);
                        shipsPlacements.push(...preComputed[index])
                        return;
                    }

                    placement = this.generatePlacement(sizeNum, gameSetup.boardSize);
                    // console.log(placement);

                    isShipCorrect = this.isPlacementInBoard(placement, gameSetup.boardSize) && this.checkPlacement(placement, shipsPlacements);
                    // console.log("ERRORS? " + shipPlacementMistakes);
                    // console.log("Is ship correct? " + isShipCorrect);
                    // console.log("REPEAT? " + !isShipCorrect);                    
                }

                shipsPlacements.push(placement);
            }
        });

        return shipsPlacements;
    }

    generatePlacement(shipSize: number, boardSize: { x: number, y: number }): ShipPlacement {
        const vertically = (Math.random() > 0.5);
        const X = Math.floor(Math.random() * (boardSize.x - ((vertically) ? 1 : shipSize)));
        const Y = Math.floor(Math.random() * (boardSize.y - ((!vertically) ? 1 : shipSize)));

        return {
            shipSize: shipSize,
            vertically: vertically,
            position: { x: X, y: Y }
        };
    }

    checkPlacement(newPlacemnt: ShipPlacement, placements: ShipPlacement[]): boolean {
        const newFields = this.getFieldsFromPlacement(newPlacemnt);

        let fail = false;
        placements.forEach(placement => {
            if (fail) {
                console.log("BREAk");

                return;
            }
            // console.log("OLD " + JSON.stringify(placement));     
            // console.log(placement);           
            // console.log("NEW " + JSON.stringify(newPlacemnt));     
            // console.log(newPlacemnt);         

            const fields = this.getFieldsFromPlacement(placement);
            let forbiddenFields: { x: number, y: number }[] = [];
            fields.forEach(field => {
                forbiddenFields.push(...this.getForbiddenFields(field));
            });

            forbiddenFields = forbiddenFields.filter((val, i, self) => {
                return i === self.findIndex((t, j) => {
                    return t.x === val.x && t.y === val.y
                })
            });
            // console.log(forbiddenFields);

            let intersect = Array.of(...forbiddenFields, ...newFields);

            intersect = intersect.filter((val, i, self) => {
                return i === self.findIndex((t, j) => {
                    return t.x === val.x && t.y === val.y
                })
            });

            // console.log(forbiddenFields.length);
            // console.log(newFields.length);
            // console.log(intersect.length);
            fail = (intersect.length !== forbiddenFields.length + newFields.length)
        });

        return !fail;
    }

    updateGameStatus(message: GameUpdateMessage) {
        console.log(message);


        this.canMove = message.isYourTurn;
        const who = message.who;

        if (who === this.name) {
            const lastMove = message.enemyMove;
            if (message.wasHit && lastMove !== undefined) {
                this.hits.push(lastMove.moveCoordinates);
                console.log("HITS " + JSON.stringify(this.hits));

            }

            if (message.wasSunk && message.sunkenShip !== null) {
                console.log(message.sunkenShip);


                message.sunkenShip.forEach((field, i) => {
                    console.log('i ' + i);

                    const forbiddenFields = this.getForbiddenFields(field);
                    forbiddenFields.forEach(forb => {
                        if (forb.x >= 0 && forb.x < this.boardSize.x && forb.y >= 0 && forb.y < this.boardSize.y) {
                            this.enemyBoard[forb.x][forb.y].wasShot = true;

                        }
                    });

                    const index = this.hits.findIndex(t => t.x === field.x && t.y === field.y);
                    if (index !== -1) {
                        this.hits.splice(index, 1);
                    }
                });
            }
        }
    }

    clearSunken(sunken: { x: number, y: number }[]) {
        sunken.forEach(sukenPart => {
            const index = this.hits.findIndex(r => sunken);

            if (index != -1) {
                this.hits.splice(index, 1);
            }

            const fieldsToDelete = [
                sukenPart,
                { x: sukenPart.x + 1, y: sukenPart.y },
                { x: sukenPart.x - 1, y: sukenPart.y },
                { x: sukenPart.x, y: sukenPart.y - 1 },
                { x: sukenPart.x, y: sukenPart.y + 1 },
            ]

            fieldsToDelete.forEach(fieldToDelete => {
                this.enemyBoard[fieldToDelete.x][fieldToDelete.y].wasShot = true;
            });
        });
    }

    calculateNextMove(): MoveData {
        let finalmove = { x: 0, y: 0 };
        let canHunt = false;
        if (this.hits.length > 0) {

            console.log("HUNT");
            const randomHitIndex = Math.floor(Math.random() * this.hits.length);

            for (let i = 0; i < this.hits.length; i++) {
                const randomHit = this.hits[(randomHitIndex + i) % this.hits.length];
                console.log("RAND " + JSON.stringify(randomHit));

                const posibleHits = [
                    { x: randomHit.x + 1, y: randomHit.y },
                    { x: randomHit.x - 1, y: randomHit.y },
                    { x: randomHit.x, y: randomHit.y - 1 },
                    { x: randomHit.x, y: randomHit.y + 1 },
                ];

                for (let i = 0; i < posibleHits.length; i++) {
                    const currMove = posibleHits[i];
                    console.log(currMove);
                    let canBreak = false;

                    if(currMove.x >= this.boardSize.x || currMove.y >= this.boardSize.y || currMove.x < 0 || currMove.y < 0) {
                        continue;
                    }
                    

                    if (!this.enemyBoard[currMove.x][currMove.y].wasShot) {
                        finalmove = currMove;
                        canBreak = true;
                        canHunt = true;
                        break;
                    }
                    if (canBreak) {
                        break;
                    }
                }
            }
        }

        if (!canHunt) {
            const possibleMoves: { x: number, y: number }[] = [];
            for (let y = 0; y < this.boardSize.y; y++) {
                for (let x = 0; x < this.boardSize.x; x++) {
                    if (!this.enemyBoard[x][y].wasShot) {
                        possibleMoves.push({ x: x, y: y });
                    }
                }
            }
            const index = Math.floor(Math.random() * possibleMoves.length);
            const randomMove = possibleMoves[index];
            finalmove = { x: randomMove.x, y: randomMove.y }
        }

        this.enemyBoard[finalmove.x][finalmove.y].wasShot = true;
        return { moveCoordinates: finalmove }
    }

    getFieldsFromPlacement(placement: ShipPlacement): { x: number, y: number }[] {
        const result: { x: number, y: number }[] = [];

        const startPlacement = placement.position;

        for (let i = 0; i < placement.shipSize; i++) {
            const field = {
                x: startPlacement.x + ((placement.vertically) ? 0 : 1) * i,
                y: startPlacement.y + ((placement.vertically) ? 1 : 0) * i
            };

            result.push(field);
        }

        return result;
    }

    getForbiddenFields(field: { x: number, y: number }): { x: number, y: number }[] {
        const result: { x: number, y: number }[] = [
            field,
            { x: field.x + 1, y: field.y },
            { x: field.x + 1, y: field.y + 1 },
            { x: field.x + 1, y: field.y - 1 },
            { x: field.x - 1, y: field.y },
            { x: field.x - 1, y: field.y + 1 },
            { x: field.x - 1, y: field.y - 1 },
            { x: field.x, y: field.y + 1 },
            { x: field.x, y: field.y - 1 },
        ]

        return result;
    }

    isPlacementInBoard(placement: ShipPlacement, boardSize: { x: number, y: number }): boolean {
        return (placement.vertically && placement.position.y + placement.shipSize < boardSize.y) ||
            (placement.position.x + placement.shipSize < boardSize.x);
    }

    testDrawBoard() {
        for (let i = 0; i < this.enemyBoard.length; i++) {
            let row = "";
            for (let j = 0; j < this.enemyBoard[i].length; j++) {
                if(this.enemyBoard[i][j].wasShot) {
                    row += "[x]"
                } else {
                    row += "[ ]";
                }
            }
            console.log(row);            
        }
    }



}