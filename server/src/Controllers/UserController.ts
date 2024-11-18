
import { request, Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController";
import UserRepository from "../Repositories/UserRepository";
import { IUserModel } from "Models/IUserModel";
import { ICreateUserData } from "Models/ICreateUserData";
import typia from "typia";
import PasswordService from "../Services/PasswordService";
import { getMiddlewareWithSession } from "../Middleware/AuthMiddleware";
import SessionService from "Services/SessionService";

class UserController implements IRestController{
    path: string = "/users";
    router: Router = Router();

    userRepository: UserRepository;
    passwordService: PasswordService;
    sessionService: SessionService;

    constructor(userRepository: UserRepository,sessionService: SessionService ) {
        this.userRepository = userRepository;
        this.sessionService = sessionService;
        this.passwordService = new PasswordService(this.userRepository);
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get(this.path,  getMiddlewareWithSession(this.sessionService), this.getAllUsers);
        this.router.get(this.path + "/user/:name",  getMiddlewareWithSession(this.sessionService), this.getUser);
        this.router.post(this.path + "/create", this.createUser);
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

        if(users === undefined) {
            users = [];
        } else {
            const parsedUsers: any[] = [];
            users.forEach(user => {
                const parsedUser = this.userRepository.parseSafe(user);
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
        
        const name = request.params["name"];
        
        let user;
        user = await this.userRepository.getUser(name);
        try {
        } catch (error) {
            console.error("Error when accessing database: " + error);
            response.status(500).send();
            
            return;
        }

        if(user === undefined) {
            response.status(404).json({message: "user not found"});
            return;
        }

        // only if auth =/= equal searched user
        const parsedUser = this.userRepository.parseSafe(user);

        response.status(200).json(parsedUser);
    }

    createUser = async (request: Request, response: Response) => {
        console.log("CREATE");
        
        let createUserData: ICreateUserData;
        try {
            createUserData = typia.assert(request.body);
        } catch (error) {
            console.error("Invalid data format" + error);
            response.status(400).json(error);
            return;
        }

        const newUser: IUserModel = {
            name: createUserData.name,
            email: createUserData.email,
            score: 0,
            password: await this.passwordService.encryptPassword(createUserData.password)
        };

        console.log("NEW USER");
        console.log(newUser);
        

        

        try {
            await this.userRepository.saveUser(newUser);
            response.status(201).send();
        } catch (error) {
            if(await this.userRepository.getUser(newUser.name)) {
                response.status(400).send("Name already in use");
            }
            console.error("Failed to save user! " + error);
            response.status(500).send("Failed to create user");
        }                
    }    
}

export default UserController;