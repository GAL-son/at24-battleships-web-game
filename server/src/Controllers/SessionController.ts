import { Router } from "express";
import RestController from "Interfaces/IRestController";


class SessionController implements RestController {
    path: string = "/";
    router: Router = Router();

    constructor() {

    }

    private initRoutes() {

    }

    createSession = (request: Request, response: Response) => {
        const sessiondata: ISessionCreateData = typia.assert(request.body);

        

    }


    

}