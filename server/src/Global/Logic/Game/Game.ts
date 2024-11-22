import IPlayer from "../../../Interfaces/IPlayer";
import Ship from "./Ship";
import Board from "./Board";
import { IGameSetup, ShipSetup} from "../../../Logic/IGameSetup";
import { MoveData, ShipPlacement } from "./Types";
import WsServerMessageBuilder from "../../../Ws/Messages/WsServerMessageBuilder";

export default class Game {

    player1?: IPlayer;
    player2?: IPlayer;

    gameStarted: boolean = false;
    gameEnded: boolean = false;
    private turn: number = 0;
    private isPlayer1Move: boolean = false;
    private shipSetup: ShipSetup;

    lastMove: {
        move: MoveData,
        isHit: boolean,
        isSunk: boolean 
    } | undefined;

    boards: {
        player1: Board;
        player2: Board;
    }

    ships: {
        player1: Ship[],
        player2: Ship[]
        alive: {
            player1: number,
            player2: number,
        }
    };



    constructor(setup: IGameSetup) {
        this.boards = {
            player1: new Board(setup.boardSize),
            player2: new Board(setup.boardSize)
        };

        this.shipSetup = setup.shipSizes;
        const count = this.countShips(setup.shipSizes);
        this.ships = {
            player1: this.prepareShips(setup.shipSizes),
            player2: this.prepareShips(setup.shipSizes),
            alive: {
                player1: count,
                player2: count,
            }
        };
    }

    public linkPlayer(player: IPlayer) {
        if(this.player1 === undefined) {
            this.player1 = player;
        } else if(this.player2 === undefined) {
            this.player2 = player;
        } else {
            throw new Error("Game is full");
        }
    }

    public countShips(shipSetup: ShipSetup) {
        return Object.values(shipSetup).reduce((a, b) => {
            return a+b;
        })
    } 

    public  canGameStart() {
        return this.player1?.isReady() && this.player2?.isReady();
    }

    public setShips(player: IPlayer, shipsPlacement: ShipPlacement[]) {

        if(this.gameStarted || this.gameEnded) {
            throw Error("Cant set ships, game already started");
        }

        if(player !== this.player1 && player !== this.player2) {
            throw new Error("Invalid player");
        }

        try {
            if(player === this.player1) {
                this.boards.player1.setShips(this.ships.player1, shipsPlacement);
            } else if (player === this.player2) {
                this.boards.player2.setShips(this.ships.player2, shipsPlacement);
            }
        } catch (error) {
            let message = "Invalid Ship Placement: ";

            if(error instanceof Error) {
                message += error.message;
            } else {
                message += "Unknown Error";
            }
            throw new Error(message);
        }

        player.setReady(true);
        console.log("PLAYER 1 BOARD")
        this.boards.player1.printBoard();
        console.log("PLAYER 2 BOARD")
        this.boards.player2.printBoard();
    }

    private validateShipPlacement(shipsPlacement: ShipPlacement[]) {
        const check = {...this.shipSetup};

        shipsPlacement.forEach(placement => {
            const size = placement.shipSize as keyof typeof this.shipSetup;

            check[size]--;
        });

        Object.keys(check).forEach((size) => {
            const key = parseInt(size) as keyof typeof check;

            if(check[key] !== 0) {
                throw new Error ("Invalid ship placement");
            }
        });
    }

    private prepareShips(shipSetup: ShipSetup) {
        const ships: Ship[] = new Array();

        const sizes = Object.keys(shipSetup);
        
        sizes.forEach(size => {
            const sizeNum: number = parseInt(size);
            const count: number = shipSetup[sizeNum as keyof typeof shipSetup]

            for (let i = 0; i < count; i++) {
                ships.push(new Ship(sizeNum));                
            }
        })     

        return ships;
    }

    public start() {
        this.isPlayer1Move = Math.random() > .5;
        this.gameStarted = true;

        this.player1?.sendMessage(WsServerMessageBuilder.createGameStartMessage(this.isPlayer1Move));
        this.player2?.sendMessage(WsServerMessageBuilder.createGameStartMessage(!this.isPlayer1Move));
    }

    public move(player: IPlayer, move: MoveData) {
        if(!this.gameStarted || this.gameEnded) {
            throw new Error("Cant make move on inactive game");
        }

        console.log("MOVE" + JSON.stringify(move.moveCoordinates));

        if(player.name == this.player1?.name) {
            this.movePlayerOne(move);
        } else if(player.name == this.player2?.name) {
            this.movePlayerTwo(move);
        } else {
            throw new Error("Invalid player");
        }        

        if(this.checkIfGameEnded()) {
            this.endGame()
        } else {
            this.nextTurn()
        }
    }

    public movePlayerOne(move: MoveData) {
        console.log("PLAYER 1");

        console.log("PLAYER 2 BOARD")
        this.boards.player2.printBoard();
        
        if(!this.isPlayer1Move) {
            throw new Error("Not your turn!");
        }       

        const field = this.boards.player2.getField(move.moveCoordinates.x, move.moveCoordinates.y);

        if(field === undefined) {
            console.log(" FIELD UNDEFINED");

        }

        if(field.hasShip()) {
            console.log(" FIELD " + JSON.stringify (move.moveCoordinates) + " HAS SHIP");
        } else {
            console.log(" FIELD " + JSON.stringify (move.moveCoordinates) + " DOES NOT HAS SHIP");

        }
        
        const isHit = this.boards.player2.hitField(move.moveCoordinates.x, move.moveCoordinates.y);
        let isDead = false;

        console.log(JSON.stringify(isHit));
        
        if(isHit) {
            isDead = isHit?.isDead() || false;
            if(isDead) {
                this.ships.alive.player2--;
            }            
        }
        
        if(this.player2 == undefined) {
            throw new Error("Missing player 2");
        }
        this.updateLastMove(move , isHit != false, isDead);
        this.sendGameUpdate(this.player2);
    }
    
    public movePlayerTwo(move: MoveData) {
        console.log("PLAYER 2");

        console.log("PLAYER 1 BOARD")
        this.boards.player1.printBoard();
        if(this.isPlayer1Move) {
            throw new Error("Not your turn!");
        }

        const isHit = this.boards.player1.hitField(move.moveCoordinates.x, move.moveCoordinates.y);
        let isDead = false;

        if(isHit) {
            isDead = isHit?.isDead() || false;
            if(isDead) {
                this.ships.alive.player1--;
            }            
        }

        if(this.player1 == undefined) {
            throw new Error("Missing player 1");
        }
        this.updateLastMove(move, isHit != false, isDead);
        this.sendGameUpdate(this.player1);
    }

    checkIfGameEnded() {
        return this.ships.alive.player1 == 0 || this.ships.alive.player2 == 0
    }

    public getWinner() {
        if(this.ships.alive.player1 == 0) {
            return this.player2;
        } else if (this.ships.alive.player2 == 0) {
            return this.player1;
        } else {
            return false;
        }
    }

    endGame() {

    }

    nextTurn() {
        this.isPlayer1Move = !this.isPlayer1Move;
        this.turn++;
    }

    public sendGameUpdate(player: IPlayer) {
        if(this.lastMove == undefined) {
            return;
        }

        const message = WsServerMessageBuilder.createGameUpdateMessage(
            this.lastMove?.move,
            this.lastMove?.isHit,
            this.lastMove?.isSunk,
            this.turn,
        );

        player.sendMessage(message);
    }

    updateLastMove(move: MoveData, isHit: boolean, isSunk: boolean) {
        this.lastMove = {
            move: move,
            isHit: isHit,
            isSunk: isSunk
        }
    }


}