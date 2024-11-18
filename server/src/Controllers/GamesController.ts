import { NextFunction, Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController"
import GameRepository from "Repositories/GameRepository";

export default class GamesController implements IRestController {
    path: string = "/games";
    router: Router = Router();

    gameRepository: GameRepository;
    authMiddleware;

    constructor(gameRepository: GameRepository, authMiddleware: (request: Request, response: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined) {
        this.gameRepository = gameRepository;
        this.authMiddleware = authMiddleware;

        this.initRoutes();
    }

    initRoutes() {
        this.router.get(this.path + "/all", this.authMiddleware, this.getAllGames)
        this.router.get(this.path + "/user/:user", this.authMiddleware, this.getUserGames)
    }

    getGame = async (request: Request, response: Response) => {
        const id = request.params["id"];

        if(!Number.isInteger(id)) {
            return response.status(400).send("Invalid id");
        }

        try {
            const game = await this.gameRepository.getGameById(parseInt(id));
            return response.status(200).json(game);
        } catch (error) {
            return response.status(404).send("No game found");
        }
    }    

    getAllGames = async (request: Request, response: Response) => {
        try {
            const games = await this.gameRepository.getAllGames();

            return response.status(200).json(games);
        } catch (error) {
            return response.status(404).send("No games found");
        }
    }

    getUserGames = async (request: Request, response: Response) => {
        const user = request.params["user"];

        try {
            const games = await this.gameRepository.getAllGamesForUser(user);

            return response.status(200).json(games);
        } catch (error) {
            return response.status(404).send("No games found");
        }
        
    }
} 