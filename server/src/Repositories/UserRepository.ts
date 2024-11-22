import { IRepository } from "Interfaces/IRepository";
import { IUserModel } from "Repositories/DataModels/IUserModel";
import { IDatabase, ParameterizedQuery } from "pg-promise";
import { errors } from "pg-promise";

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

    async getUserByEmail(email: string) {
        this.validateDb();

        const query = `SELECT * FROM ${this.table} where email = $1`;
        return this.db?.one<IUserModel>(query, [email]);
    }
    
    async getUser(name: string) {
        this.validateDb();        
        const query = `SELECT * FROM ${this.table} WHERE name = $1 `;
        try {
            return await this.db?.one<IUserModel>(query, [name])
        } catch (error) {
            if(error instanceof errors.QueryResultError) {
                if(error.code === errors.queryResultErrorCode.noData) {
                    return undefined;
                }
                
                throw error;
            }
        }
    }

    async saveUser(user: IUserModel) {
        this.validateDb();
        const query = `INSERT INTO ${this.table} VALUES ($1, $2, $3, $4) RETURNING name`;
        return this.db?.one(query, [user.name, user.email, user.score, user.password]);
    }

    async deleteUser(name: string) {
        this.validateDb();
        const query = `DELETE from ${this.table} WHERE name = $1`;
        return this.db?.query(query, [name]);
    }

    async updateEmail(name: string, newEmail: string) {
        this.validateDb();
        const query = `UPDATE ${this.table} SET email = $1 WHERE name = $2`;
        return this.db?.query(query, [newEmail, name]);
    }

    async updatePassword(name: string, newEmail: string) {
        this.validateDb();
        const query = `UPDATE ${this.table} SET password = $1 WHERE name = $2`;
        return this.db?.query(query, [newEmail, name]);
    }
    
    public parseSafe(userUnsafe: IUserModel) {
        return {
            score: userUnsafe.score,
            name: userUnsafe.name
        };
    }

    validateDb() : void {
        if(this.db == null) {
            throw Error("NO DATABASE CONNECTED");
        }
    }    
}

export default UserRepository;