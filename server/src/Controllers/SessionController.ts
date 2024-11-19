
import { Request, Response, Router } from "express";
import RestController from "Interfaces/IRestController";
import { IAuthData } from "Models/IAuthData";
import UserRepository from "Repositories/UserRepository";
import PasswordService from "../Services/PasswordService";
import SessionService from "Services/SessionService";
import typia from "typia";
import { getMiddlewareWithSession } from "../Middleware/AuthMiddleware";
import { AuthError, NotFoundError } from "../Errors/Errors";

import WsSessionService from "Services/WsSessionService";


export default class SessionController implements RestController {
    path: string = "/session";
    router: Router = Router();

    sessionService: SessionService;
    
    wsSessionService: WsSessionService;
    userRepository: UserRepository;
    passwordService: PasswordService;

    authMiddleware;

    constructor(
        userRepository: UserRepository,
        wsSessionService: WsSessionService,
        sessionService: SessionService,
    ) {
        this.sessionService = sessionService;
        this.wsSessionService = wsSessionService;
        this.userRepository = userRepository;
        this.passwordService = new PasswordService(this.userRepository);


        this.authMiddleware = getMiddlewareWithSession(this.sessionService);
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(this.path + "/create", this.createSession);
        this.router.post(this.path + "/delete", this.authMiddleware, this.deleteSession);
        this.router.post(this.path + "/game/create", this.authMiddleware, this.createGameSession);
        this.router.post(this.path + "/game/delete", this.authMiddleware, this.deleteSession);
    }

    createSession = async (request: Request, response: Response) => {
        const sessiondata: IAuthData = typia.assert(request.body);
        
        let session = this.sessionService.getSessionForUser(sessiondata.name);

        if(session) {            
            return response.status(201).json({token: session.token});
        }        

        try {
            const user = await this.passwordService.validatePassword(sessiondata);
            const sessionData = {
                user: {
                    name: user.name,
                    email: user.email,
                    score: user.score,
                }
            };
    
            const token = this.sessionService.createSession(sessionData);    

            response.status(201).json({token: token});
        } catch (e){

            if(e instanceof AuthError || e instanceof NotFoundError) {
                response.status(401).send(e.message);
            } else if (e instanceof Error) {
                response.status(500).send("Unknown Error: " + e.message);
            }
        }            
    }
    
    deleteSession = async(request: Request, response: Response) => {
        const token = request.body["token"];

        if(!token) {
            response.status(400).send("Token Missing");
        }

        this.sessionService.deleteSession(token);

        response.status(200).send();
    }

    createGameSession = async(request: Request, response: Response) => {
        const sessionKey = this.wsSessionService.createSession();

        response.status(201).json({'uuid': sessionKey});
    }
    
    deleteGameSession = async(request: Request, response: Response) => {

    }

}