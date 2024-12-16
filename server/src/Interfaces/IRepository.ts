import { IDatabase } from "pg-promise";

export interface IRepository {
    name: string;
    linkDb(db: IDatabase<any>): void;
}