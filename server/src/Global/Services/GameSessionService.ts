import ISessionModel from "Repositories/DataModels/ISessionModel";
import { IUserModel } from "Global/Database/Models/IUserModel";


export default class GameSessionService {
    sessions: ISessionModel[] = [];

    constructor() {

    }

    createSession(user: IUserModel) {
        
    }
}