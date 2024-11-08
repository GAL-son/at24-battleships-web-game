import { IRepository } from "Interfaces/IRepository";
import { IDatabase } from "pg-promise";

class UserRepository implements IRepository {
    name: string;
    db?: IDatabase<any>;

    constructor(name: string) {
        this.name = name;
    }

    linkDb(db: IDatabase<any>): void {
        this.db = db;    
    }

    // getUsers() : Promise<any> {
        
    // }

    validateDb() : boolean {
        return (this.db != null);
    }
    
}

export default UserRepository;