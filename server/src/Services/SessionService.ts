import JWTService from "./JWTService";
import ISessionModel from "Models/ISessionModel";


class SessionService {
    readonly DEFAULT_LIFETIME_MINUTES: number = 30;

    jwtService: JWTService;
    sessions: ISessionModel[] = [];

    constructor() {
        this.jwtService = new JWTService();
    }

    createSession(payload: any, lifetimeMinutes: number = this.DEFAULT_LIFETIME_MINUTES) {
        const token = this.jwtService.createToken(payload, lifetimeMinutes);

        const session = {
            token: token,
            data: payload
        } as ISessionModel;

        this.sessions.push(session);

        return token;
    }   

    deleteSession(token: string) {
        this.sessions.forEach((session, i) => {
            if(session.token = token) {
                this.sessions.splice(i, 1);
            }
        });
    }

    validateSession(token: string) {
        let valid = false;

        this.sessions.forEach(session => {
            if(session.token === token) {
                valid = true;
            }
        });

        return valid;
    }

    clearOldSessions() {
        
    }
}

export default SessionService;