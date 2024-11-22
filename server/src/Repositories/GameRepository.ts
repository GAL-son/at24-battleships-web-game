import { IRepository } from "Interfaces/IRepository";
import { IGameModel } from "Repositories/DataModels/IGameModel";
import { IDatabase } from "pg-promise";

export default class GameRepository implements IRepository {
    name: string;
    db?: IDatabase<any>;

    table: string = 'BattleshipsDB.games';

    constructor(name: string) {
        this.name = name;
    }

    linkDb(db: IDatabase<any>): void {
        this.db = db;    
    }

    async getAllGames() {
        this.validateDb();
        const query = `SELECT * FROM ${this.table}`;
        return this.db?.any<IGameModel>(query);
    }
    
    async getAllGamesForUser(name: string) {
        this.validateDb();
        const query = `SELECT * FROM ${this.table} WHERE player1Name = $1 OR player2Name = $1`;
        return this.db?.any<IGameModel>(query, [name]);
    }
    
    async getGameById(id: number) {
        this.validateDb();
        const query = `SELECT * FROM ${this.table} WHERE gameId = $1`;
        return this.db?.any<IGameModel>(query, [id]);
    }

    async saveGame(game: IGameModel) {
        this.validateDb();
        const query = `INSERT INTO ${this.table} VALUES [DEFAULT, $1, $2, $3, $4] returning gameId`;
        return this.db?.query(query, [game.player1Name, game.player2Name, game.player1Winner, game.length]);
    }

    validateDb() : void {
        if(this.db == null) {
            throw Error("NO DATABASE CONNECTED");
        }
    } 

}