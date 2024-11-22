import ISessionModel from "Repositories/DataModels/ISessionModel";
import { IUserModel } from "Repositories/DataModels/IUserModel";


export default class GameSessionService {
    sessions: ISessionModel[] = [];

    constructor() {

    }

    createSession(user: IUserModel) {
        
    }
}