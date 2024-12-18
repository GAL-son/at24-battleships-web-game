
import { Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController";
import UserRepository from "../Database/Repositories/UserRepository";
import { IUserModel } from "../Database/Models/IUserModel";
import { CreateUserData } from "../Resources/UserControllerMessages";
import typia, {tags} from "typia";
import PasswordService from "../Services/PasswordService";
import { getMiddlewareWithSession } from "../Middleware/AuthMiddleware";
import SessionService from "../Services/SessionService";
import ISessionModel from "../Database/Models/ISessionModel";
// import UserRepository from "../../Global/Database/Repositories/UserRepository";
// import { IUserModel } from "Global/Database/Models/IUserModel";
// import { CreateUserData } from "Resources/UserControllerMessages";
// import typia, { tags } from "typia";
// import PasswordService from "../Rest/Services/PasswordService";
// import { getMiddlewareWithSession } from "../Middleware/AuthMiddleware";
// import SessionService from "Rest/Services/SessionService";
// import ISessionModel from "Repositories/DataModels/ISessionModel";

class UserController implements IRestController {
    path: string = "/users";
    router: Router = Router();

    userRepository: UserRepository;
    passwordService: PasswordService;
    sessionService: SessionService;

    authMiddleware;

    constructor(userRepository: UserRepository, sessionService: SessionService) {
        this.userRepository = userRepository;
        this.sessionService = sessionService;
        this.passwordService = new PasswordService(this.userRepository);
        this.authMiddleware = getMiddlewareWithSession(this.sessionService);
        this.initRoutes();

    }

    private initRoutes() {
        this.router.get(this.path, this.authMiddleware, this.getAllUsers);
        this.router.get(this.path + "/user/:name", this.authMiddleware, this.getUser);
        this.router.post(this.path + "/create", this.createUser);
        this.router.delete(this.path + "/user/:name/delete", this.authMiddleware, this.deleteUser);
        this.router.patch(this.path + "/user/:name/update", this.authMiddleware, this.updateUser);
    }

    updateUser = async(request: Request, response: Response) => {
        const session = request.body["session"];
        const userToUpdate = request.params["name"];
        
        const userDb = await this.userRepository.getUser(userToUpdate);
        if(!userDb) {
            return response.status(404).send("No such user");
        }

        if(!this.canEditUser(session, userDb.name)) {
            return response.status(403).send("Action is forbidden");
        }

        let newEmail: string & tags.Format<'email'> = request.body["email"];
        let newpassword = request.body["password"];        
        
        if(newEmail) {
            try {
                newEmail = typia.assert<string & tags.Format<'email'>>(newEmail);
            } catch (e) {
                return response.status(400).send("Invalid Email");
            }
            
            try {
                await this.userRepository.updateEmail(userDb.name,newEmail);            
                return response.status(204).send("Email updated"); 
            } catch (e) {
                return response.status(500).send("Failed when updating email");
            }
        } else if(newpassword) {            
            try {
                const parsedPasswd = await this.passwordService.encryptPassword(newpassword);
                await this.userRepository.updateEmail(userDb.name,parsedPasswd);            
                return response.status(204).send("PasswordUpdated"); 
            } catch (e) {
                return response.status(500).send("Failed when updating password");
            }
        }
        
    }

    deleteUser = async (request: Request, response: Response) => {
        const session = request.body["session"];
        const userToDelete = request.params["name"];

        if(!session) {
            response.status(401).send("No session found");
            return;
        }

        // console.log(session.data);

        const userDb = await this.userRepository.getUser(userToDelete);
        if(!userDb) {
            return response.status(404).send("No such user");
        }

        if(!this.canEditUser(session, userDb.name)) {
            return response.status(403).send("Action is forbidden");
        }

        try {
            await this.userRepository.deleteUser(userDb.name);
            this.sessionService.deleteSessionsForUser(userDb.name);
            
            return response.status(204).send(); 
        } catch (e) {
            return response.status(500).send("Failed when deleting user");
        }
    }

    getAllUsers = async (request: Request, response: Response) => {
        let users;
        try {
            users = await this.userRepository.getUsers();
        } catch (error) {
            console.error("Error when reading database: " + error);
            response.status(500).send();
            return;
        }

        if (users === undefined) {
            users = [];
        } else {
            const parsedUsers: any[] = [];
            users.forEach((user: IUserModel) => {
                const parsedUser = this.userRepository.parseSafe(user);
                parsedUsers.push(parsedUser);
            });

            users = parsedUsers;
        }

        users.sort((a, b) => {
            return (b?.score || 0) - (a?.score || 0);
        })

        response.status(200).json(users);
    }

    getUser = async (request: Request, response: Response) => {
        const session = request.body["session"];
        const name = request.params["name"];

        let user;
        try {
            user = await this.userRepository.getUser(name);
        } catch (error) {
            console.error("Error when accessing database: " + error);
            response.status(500).send();
            return;
        }

        if (!user) {
            response.status(404).send("user not found");
            return;
        }

        // only if auth =/= equal searched user
        if(this.canEditUser(session, user.name)) {
            return response.status(200).json(
                {
                    name: user.name,
                    email: user.email,
                    score: user.score
                }
            );
        }
        response.status(200).json(this.userRepository.parseSafe(user));
    }

    createUser = async (request: Request, response: Response) => {
        let createUserData: CreateUserData;
        try {
            createUserData = typia.assert<CreateUserData>(request.body);
        } catch (error) {
            console.error("Invalid data format: " + error);
            console.error(request.body);

            response.status(400).json(error);
            return;
        }
        
        const newUser: IUserModel = {
            name: createUserData.name,
            email: createUserData.email,
            score: 0,
            password: await this.passwordService.encryptPassword(createUserData.password)
        };
        
        if (await this.userRepository.getUser(newUser.name)) {
            console.error("USERNAME TAKEN");
            return response.status(400).send("Name already in use");
        }

        try {
            await this.userRepository.saveUser(newUser);
            response.status(201).send();
        } catch (error) {  
            console.error("Failed to save user! " + error);
            response.status(500).send("Failed to create user");
        }
    }

    private canEditUser(session: ISessionModel, name: string) {
        return name === session.data.user.name;
    }
}

export default UserController;