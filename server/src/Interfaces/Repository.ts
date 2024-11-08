import { IDatabase } from "pg-promise";

interface Repository {
    name: string;

    construct(name: string): void;
    linkDb(db: IDatabase<any>): void;
}

export default Repository;