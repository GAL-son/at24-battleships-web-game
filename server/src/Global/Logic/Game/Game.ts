import IPlayer from "../../../Interfaces/IPlayer";
import Ship from "./Ship";
import Board from "./Board";
import { IGameSetup, ShipSetup} from "../../../Logic/IGameSetup";
import { MoveData, ShipPlacement } from "./Types";
import WsServerMessageBuilder from "../../../Ws/Messages/WsServerMessageBuilder";
import { GameEndReason, ServerMessages } from "../../../Ws/Messages/Types/WsServerMessages";
import ScoreService from "Ws/Services/ScoreService";
import { GameResult, PlayerResult } from "Ws/Types/GameResult";

export default class Game {

    player1?: IPlayer;
    player2?: IPlayer;

    gamesetup;
    gameStarted: boolean = false;
    gameEnded: boolean = false;
    private turn: number = 0;
    private isPlayer1Move: boolean = false;
    private shipSetup: ShipSetup;

    lastMove: {
        move: MoveData,
        isHit: boolean,
        isSunk: boolean 
        who: string;
        sunkenShip: {x: number, y:number}[] | null;
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

    stats: {
        player1: {
            hit: number
            miss: number
        },
        player2: {
            hit: number,
            miss: number
        }
    }

    serviceDeleteGame;
    updateScore;

    constructor(
        setup: IGameSetup,
        seviceDeleteGame: () => void,
        updateScore: (name: string, gameResult: GameResult) => Promise<number>
    ) {
        this.gamesetup = setup;
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

        this.serviceDeleteGame = seviceDeleteGame;
        this.updateScore = updateScore;

        const initStats = {hit: 0, miss: 0};
        this.stats = {player1: initStats, player2: initStats}
    }

    getLength() {
        return this.turn+1;
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
        console.log(this.player1);
        console.log(this.player2);
        console.log(this.player1?.isReady());
        console.log(this.player2?.isReady());
        
        return this.player1?.isReady() && this.player2?.isReady();
    }

    public setShips(player: IPlayer, shipsPlacement: ShipPlacement[]) {
        
        this.validateShipPlacement(shipsPlacement);
        console.log("SET SHIPS FOR " + player.name);
        if(this.gameStarted || this.gameEnded) {
            throw Error("Cant set ships, game already started");
        }
        
        if(player !== this.player1 && player !== this.player2) {
            throw new Error("Invalid player");
        }
        
        try {
            if(player === this.player1) {
                this.boards.player1.setShips(this.ships.player1, shipsPlacement);
                this.player1.setReady(true);
            } else if (player === this.player2) {
                this.boards.player2.setShips(this.ships.player2, shipsPlacement);
                this.player2.setReady(true);
            }
            console.log("UPDATE SHIPS");
            
            console.log(this.canGameStart);
            
        } catch (error) {
            let message = "Invalid Ship Placement: ";

            if(error instanceof Error) {
                message += error.message;
            } else {
                message += "Unknown Error";
            }
            throw new Error(message);
        }
    }
    
    private validateShipPlacement(shipsPlacement: ShipPlacement[]) {
        let countShips = 0;
        const check = {...this.shipSetup};
        
        shipsPlacement.forEach(placement => {
            const size = placement.shipSize as keyof typeof this.shipSetup;
            countShips++;
            check[size]--;
        });
        console.log("VALIDATE1");
        
        if(countShips !== this.ships.alive.player1) {
            console.log("VALIDATE2");
            console.log("SHIPS COUNT" + countShips);
            throw new Error("Invalid ship placement");
        }
        
        console.log("VALIDATE3");
        Object.keys(check).forEach((size) => {
            const key = parseInt(size) as keyof typeof check;
            
            if(check[key] !== 0) {
                console.log("VALIDATE4");
                throw new Error ("Invalid ship placement");
            }
        });
        console.log("VALIDATE4");
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
        
        // console.log("MOVE" + JSON.stringify(move.moveCoordinates));
        
        if(player.name == this.player1?.name) {
            this.movePlayerOne(move);
        } else if(player.name == this.player2?.name) {
            this.movePlayerTwo(move);
        } else {
            throw new Error("Invalid player");
        }        
        
        if(this.checkIfGameEnded()) {
            this.endGame();
            return;
        } else {
            this.nextTurn()
        }
        
        if(this.player1 !== undefined && this.player2 !== undefined) {
            console.log("UPDATE");
            
            this.sendGameUpdate(this.player2);
            this.sendGameUpdate(this.player1);
        }
    }
    
    public movePlayerOne(move: MoveData) {
        console.log("PLAYER 1");
        console.log(move);        
        if(!this.isPlayer1Move) {
            throw new Error("Not your turn!");
        }       
        
        const field = this.boards.player2.getField(move.moveCoordinates.x, move.moveCoordinates.y);        
        const isHit = this.boards.player2.hitField(move.moveCoordinates.x, move.moveCoordinates.y);
        let isDead = false;
        let sunkenShip: {x: number, y:number}[] | null= null;
        
        if(isHit) {
            this.stats.player1.hit++;
            isDead = isHit?.isDead() || false;
            if(isDead) {
                sunkenShip = this.boards.player2.getShipFields(isHit);
                this.ships.alive.player2--;
            }            
        } else {
            this.stats.player1.miss++;
        }
        
        if(this.player1 == undefined) {
            throw new Error("Missing player 1");
        }
        this.updateLastMove(move , isHit != false, isDead, this.player1.name, sunkenShip);
    }
    
    public movePlayerTwo(move: MoveData) {
        console.log("PLAYER 2");
        console.log(move);

        if(this.isPlayer1Move) {
            throw new Error("Not your turn!");
        }

        const isHit = this.boards.player1.hitField(move.moveCoordinates.x, move.moveCoordinates.y);
        let isDead = false;
        let sunkenShip: {x: number, y:number}[] | null= null;
        
        if(isHit) {
            this.stats.player2.hit++;
            isDead = isHit?.isDead() || false;
            if(isDead) {
                this.ships.alive.player1--;
                sunkenShip = this.boards.player1.getShipFields(isHit);
            }            
        }else {
            this.stats.player2.miss++;
        }
        
        if(this.player2 == undefined) {
            throw new Error("Missing player 2");
        }
        this.updateLastMove(move, isHit != false, isDead, this.player2.name, sunkenShip);
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

    async sendEndGameMessage(player: IPlayer) {

        const winner = this.getWinner();
        if(winner == false || winner === undefined) {
            throw new Error("Game not ended");
        }

        const didyouWon = ((winner as IPlayer).name == player.name);

        const result: GameResult = {
            winner: winner?.name,
            boardSize: this.gamesetup.boardSize,
            player1: this.getPlayer1Result(),
            player2: this.getPlayer2Result(),
            turns: this.getLength()
        }

        const scoreChange = await this.updateScore(player.name, result);

        const gameEndMessage = WsServerMessageBuilder.createGameEndedMessage(
            didyouWon,
            this.turn +1,
            scoreChange,
            GameEndReason.SHIPS_DESTROYES
        );

        player.sendMessage(gameEndMessage);
    }

    getPlayer1Result() {
        const ships = this.ships.player1.map((s) => {
            return {size: s.getSize(), hp: s.getHp()};
        });

        return {
            name: this.player1?.name,
            score: this.player1?.score,
            hits: this.stats.player1.hit,
            misses: this.stats.player1.miss,
            ships: ships
        } as PlayerResult
    }

    getPlayer2Result() {
        const ships = this.ships.player2.map((s) => {
            return {size: s.getSize(), hp: s.getHp()};
        });

        return {
            name: this.player2?.name,
            score: this.player2?.score,
            hits: this.stats.player2.hit,
            misses: this.stats.player2.miss,
            ships: ships
        } as PlayerResult
    }

    endGame() {
        if(this.player1!== undefined) {
            this.sendGameUpdate(this.player1);
            this.sendEndGameMessage(this.player1);
        }
        
        if (this.player2!== undefined) {
            this.sendGameUpdate(this.player2);
            this.sendEndGameMessage(this.player2);
        }
        this.gameEnded = true;
        this.serviceDeleteGame();
    }

    nextTurn() {
        this.isPlayer1Move = !this.isPlayer1Move;
        this.turn++;
    }

    public sendGameUpdate(player: IPlayer) {
        if(this.lastMove == undefined) {
            return;
        }

        const isPlayerTurn = 
            (!this.gameEnded) &&
            (player.name == (this.isPlayer1Move ? this.player1?.name : this.player2?.name));

        const message = WsServerMessageBuilder.createGameUpdateMessage(
            this.lastMove?.move,
            this.lastMove?.isHit,
            this.lastMove?.isSunk,
            this.turn,
            this.lastMove.who,
            isPlayerTurn,
            this.lastMove.sunkenShip
        );

        player.sendMessage(message);
    }

    updateLastMove(move: MoveData, isHit: boolean, isSunk: boolean, who: string, sunkenShip: {x: number, y:number}[] | null) {
        this.lastMove = {
            move: move,
            isHit: isHit,
            isSunk: isSunk,
            who: who,
            sunkenShip: sunkenShip
        }
    }


}