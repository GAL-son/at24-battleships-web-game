import JWTService from "../../Rest/Services/JWTService";
import ISessionModel from "Repositories/DataModels/ISessionModel";


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

    getSession(token: string) {
        let session;

        this.sessions.forEach(s => {
            if(s.token === token) {
                session = s;
            }
        });

        return session;
    }

    getSessionForUser(name: string): undefined | ISessionModel {
        let session;
        this.sessions.forEach((s) => {
            if(s.data.user.name == name) {
                session = s;
            }
        });

        return session;
    }

    deleteSessionsForUser(name: string) {
        this.sessions.forEach((s, i) => {
            if(s.data.user.name == name) {
                this.sessions.splice(i, 1);
            }
        });
    } 
}

export default SessionService;