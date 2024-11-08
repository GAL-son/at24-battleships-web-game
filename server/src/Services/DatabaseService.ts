import * as pgPromise from 'pg-promise';
import { IInitOptions, IDatabase, IMain } from 'pg-promise';

import Repository from 'Interfaces/Repository';

class DatabaseService {
    db: IDatabase<any>;

    repositories: Map<String, Repository>;

    constructor(dbConfig: any, repositories : Repository[]) {        
        let pgp: IMain = pgPromise.default();
        this.db = pgp("");

        this.repositories = new Map<String, Repository>();
        repositories.forEach(repo => {
            repo.linkDb(this.db);
            this.repositories.set(repo.name, repo);
        });
    }    

    repository(name: string) : Repository  {
        let repo = this.repositories.get(name);
        if(repo === undefined) {
            throw Error("No such repository");
        }

        return repo;
    }
}

export default DatabaseService;