
import { Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController";
import UserRepository from "../Repositories/UserRepository";

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
        this.router.get(this.path, this.getAllUsers)
    }

    getAllUsers = async (request: Request, response: Response) => {
        let users = await this.userRepository.getUsers();
        console.log("Database responsed");

        if(users === undefined) {
            users = [];
        } else {
            const parsedUsers: any[] = [];
            users.forEach(user => {
                const parsedUser = {
                    userid: user.userid,
                    name: user.name,
                    email: user.email,
                    score: user.score || 0
                }

                parsedUsers.push(parsedUser);
            });

            users = parsedUsers;
        }

        response.status(200).json(users);
    }
}

export default UserController;