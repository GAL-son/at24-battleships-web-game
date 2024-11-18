
import { request, Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController";
import UserRepository from "../Repositories/UserRepository";
import { IUserModel } from "Models/IUserModel";

class UserController implements IRestController{
    path: string = "/users";
    router: Router = Router();

    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        // console.log(userRepository);
        this.userRepository = userRepository;
        console.log(this.userRepository);

        this.initRoutes();
    }

    private initRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.get(this.path + "/:id", this.getUser);
    }

    getAllUsers = async (request: Request, response: Response) => {
        let users = await this.userRepository.getUsers().catch((error) => {
            console.error("Error when reading database: " + error);
            response.status(500);
            return;
        });
        console.log("Database responsed");

        if(users === undefined) {
            users = [];
        } else {
            const parsedUsers: any[] = [];
            users.forEach(user => {
                const parsedUser = this.parseSafe(user);
                parsedUsers.push(parsedUser);
            });

            users = parsedUsers;
        }

        users.sort((a,b) => {
            return (b?.score || 0) - (a?.score || 0);
        })

        response.status(200).json(users);
    }

    getUser = async (request: Request, response: Response) => {
        
        const id = parseInt(request.params["id"]);
        
        let user = await this.userRepository.getUserById(id).catch(error => {
            console.error("Error when accessing database: " + error);
            response.status(500);
            
            return;
        })
        console.log("HERE" + user + " " + id);

        if(user === undefined) {
            response.status(404).json({message: "user not found"});
            return;
        }

        // only if auth =/= equal searched user
        const parsedUser = this.parseSafe(user);

        response.status(200).json(parsedUser);
    }

    private parseSafe(userUnsafe: IUserModel) {
        return {
            userId: userUnsafe.userid,
            score: userUnsafe.score,
            name: userUnsafe.name
        };
    }

    
}

export default UserController;