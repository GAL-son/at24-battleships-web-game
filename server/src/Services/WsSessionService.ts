import { IWsConectionCredentials } from "Logic/Interfaces/IWsConnectionCredentials";
import { WebSocketWrapper } from "Logic/Interfaces/WebSocketWrapper";
import ISessionModel from "../Database/Models/ISessionModel";
import { WsSession } from "Resources/Types/Sessions";

import { randomUUID } from "crypto";


export default class WsSessionService {
    
    readonly DEFAULT_WS_SESSION_LIFETIME_MS = 600000;
    sessions: Map<string, WsSession> = new Map();   

    createSession(sessionData: ISessionModel) {
        const newUuid = randomUUID();
        const now = Date.now();
        this.sessions.set(
            newUuid, 
            {
                uuid: newUuid, 
                session: sessionData,
                expires: now + this.DEFAULT_WS_SESSION_LIFETIME_MS
            }
        );
        
        return newUuid;
    }    
    
    validateSession(uuid: string) {        
        const credentials = this.sessions.get(uuid);

        if(!credentials) {
            return false;
        }

        const currentTime = Date.now();

        if(credentials.expires < currentTime) {
            return false;
        }

        return true;
    }

    deleteSession(uuid: string) {
        return this.sessions.delete(uuid);
    }

    getSession(uuid: string) {
        return this.sessions.get(uuid);
    }


}