import { Request, Response, Router } from "express";
import RestController from "Interfaces/IRestController";
import { ISessionCreateData } from "Models/ISessionCreateData";
import Session from "Models/Session";
import typia from "typia";


class SessionController implements RestController {
    path: string = "/session";
    router: Router = Router();

    sessions: Session[] = [];

    constructor() {

    }

    private initRoutes() {

    }

    createSession = (request: Request, response: Response) {
        const sessiondata: ISessionCreateData = typia.assert(request.body);


    }


    

}