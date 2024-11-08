import * as pgPromise from 'pg-promise';
import { IInitOptions, IDatabase, IMain } from 'pg-promise';

import { IRepository } from 'Interfaces/IRepository';

class DatabaseService {
    db: IDatabase<any>;

    repositories: Map<String, IRepository>;

    constructor(dbConfig: any) {        
        let pgp: IMain = pgPromise.default();
        this.db = pgp(dbConfig);
        this.repositories = new Map<String, IRepository>();        
    }    

    withRepositories(repositories : IRepository[]) {
        repositories.forEach(repo => {
            repo.linkDb(this.db);
            this.repositories.set(repo.name, repo);
        });

        return this;
    }

    repository<T extends IRepository>(name: string) : T  {
        let repo = this.repositories.get(name);
        if(repo === undefined) {
            throw Error("No such repository");
        }

        return repo as T;
    }
}

export default DatabaseService;