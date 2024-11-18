import { Request, Response, Router } from "express";
import RestController from "Interfaces/IRestController";
import { ISessionCreateData } from "Models/ISessionCreateData";
import Session from "Models/ISessionModel";
import SessionService from "Services/SessionService";
import typia from "typia";


class SessionController implements RestController {
    path: string = "/session";
    router: Router = Router();
    sessionService: SessionService;

    constructor(sessionService: SessionService) {
        this.sessionService = sessionService;
    }

    private initRoutes() {

    }

    createSession = (request: Request, response: Response) => {
        const sessiondata: ISessionCreateData = typia.assert(request.body);

        



        

    }


    

}