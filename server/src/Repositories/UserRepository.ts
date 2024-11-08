import { IRepository } from "Interfaces/IRepository";
import { IUserModel } from "Models/IUserModel";
import { IDatabase, ParameterizedQuery } from "pg-promise";

class UserRepository implements IRepository {
    name: string;
    db?: IDatabase<any>;

    table: string = 'BattleshipsDB.users';

    constructor(name: string) {
        this.name = name;
    }

    linkDb(db: IDatabase<any>): void {
        this.db = db;    
    }

    async getUsers() {
        this.validateDb();
        
        const sql = `SELECT * FROM ${this.table}`;
        return await this.db?.any<IUserModel>(sql);
    }
    
    async getUserById(id: number) {
        this.validateDb();
        
        const query = `SELECT * FROM ${this.table} WHERE userid = $1 `;
        this.db?.one<IUserModel>(query, [id]);
    }

    async saveUser(user: IUserModel) {
        const query = `INSERT INTO ${this.table} VALUES (DEFAULT, $1, $2, $3, $4) RETURNING userid`;
        return this.db?.one(query, [user.name, user.email, user.score || 0, user.password]);
    }


    validateDb() : void {
        if(this.db == null) {
            throw Error("NO DATABASE CONNECTED");
        }
    }
    
}

export default UserRepository;