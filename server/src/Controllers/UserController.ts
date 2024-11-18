
import { request, Request, Response, Router } from "express";
import IRestController from "Interfaces/IRestController";
import UserRepository from "../Repositories/UserRepository";
import { IUserModel } from "Models/IUserModel";
import { ICreateUserData } from "Models/ICreateUserData";
import typia from "typia";

class UserController implements IRestController{
    path: string = "/users";
    router: Router = Router();

    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(this.path + "/create", this.createUser);
        this.router.get(this.path + "/:id([0-9]+)", this.getUser);
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
        
        let user;
        user = await this.userRepository.getUserById(id);
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
        const parsedUser = this.parseSafe(user);

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
            userid: 0,
            name: createUserData.name,
            email: createUserData.email,
            score: 0,
            password: createUserData.password
        };

        try {
            this.userRepository.saveUser(newUser);
            response.status(201).send();
        } catch (error) {
            console.error("Failed to save user! " + error);
            response.status(500).send();
        }                
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