import { IRepository } from "Interfaces/IRepository";
import { IDatabase } from "pg-promise";

class UserRepository implements IRepository {
    name: string;
    db?: IDatabase<any>;

    schema: string = 'BattleshipsDB';

    constructor(name: string) {
        this.name = name;
    }

    linkDb(db: IDatabase<any>): void {
        this.db = db;    
    }

    async getUsers() {
        const sql = `SELECT * FROM ${this.schema}.users`;
        if(!this.validateDb()) {
            throw Error("NO DATABASE CONNECTED");
        }

        return this.db?.any(sql);
    }

    validateDb() : boolean {
        return (this.db != null);
    }
    
}

export default UserRepository;