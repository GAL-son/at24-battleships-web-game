import JWTService from "./JWTService";
import ISessionModel from "Models/ISessionModel";


class SessionService {
    readonly DEFAULT_LIFETIME_MINUTES: number = 30;

    jwtService: JWTService;
    sessions: ISessionModel[] = [];

    constructor(jwtService: JWTService) {
        this.jwtService = jwtService;
    }

    createSession(payload: any, lifetimeMinutes: number = this.DEFAULT_LIFETIME_MINUTES) {
        const token = this.jwtService.createToken(payload, lifetimeMinutes);

        const session = {
            token: token,
            data: payload
        } as ISessionModel;
    }   

    deleteSession(token: string) {
        this.sessions.forEach((session, i) => {
            if(session.token = token) {
                this.sessions.splice(i, 1);
            }
        });
    }

    clearOldSessions() {
        
    }
}

export default SessionService;