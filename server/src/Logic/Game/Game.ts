import IPlayer from "../../Interfaces/IPlayer";
import Ship from "./Ship";
import Board from "./Board";
import { IGameSetup, ShipSetup} from "../IGameSetup";
import { IShipPlacement } from "Messages/Types/WsPlayerMessages";

export default class Game {

    player1?: IPlayer;
    player2?: IPlayer;

    gameStarted: boolean = false;
    gameEnded: boolean = false;
    private turn: number = 0;
    private isPlayer1Move: boolean = false;
    private shipSetup: ShipSetup;

    boards: {
        player1: Board;
        player2: Board;
    }

    ships: {
        player1: Ship[],
        player2: Ship[]
    };

    constructor(setup: IGameSetup) {
        this.boards = {
            player1: new Board(setup.boardSize),
            player2: new Board(setup.boardSize)
        };

        this.shipSetup = setup.shipSizes;
        this.ships = {
            player1: this.prepareShips(setup.shipSizes),
            player2: this.prepareShips(setup.shipSizes),
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

    private canGameStart() {
        return this.player1?.isReady() && this.player2?.isReady();
    }

    private setShips(player: IPlayer, shipsPlacement: IShipPlacement[]) {

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
    }

    private validateShipPlacement(shipsPlacement: IShipPlacement[]) {
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
}