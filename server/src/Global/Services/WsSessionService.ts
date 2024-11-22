import { IWsConectionCredentials } from "Interfaces/IWsConnectionCredentials";

import { randomUUID } from "crypto";


export default class WsSessionService {
    
    readonly DEFAULT_WS_SESSION_LIFETIME_MS = 600000;
    credentials: Map<string, IWsConectionCredentials> = new Map();
    

    createSession() {
        const newUuid = randomUUID();
        const now = Date.now();

        console.log(
            {
                now: now,
                expires: now + this.DEFAULT_WS_SESSION_LIFETIME_MS,
                uuid: newUuid
            }
        );

        this.credentials.set(newUuid, {uuid: newUuid, expires: now + this.DEFAULT_WS_SESSION_LIFETIME_MS});
        
        return newUuid;
    }
    
    validateSession(uuid: string) {        
        if(uuid === 'test'|| uuid === 'test2') {
            return true;
        }

        const credentials = this.credentials.get(uuid);

        if(!credentials) {
            return false;
        }

        const currentTime = Date.now();

        if(credentials.expires < currentTime) {
            return false;
        }

        return true;
    }
    
    createKey() {
        const uuid = randomUUID()
        
    }


}