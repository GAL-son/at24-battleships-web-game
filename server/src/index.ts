
import * as dotenv from 'dotenv';
dotenv.config();

import AppServer from "./AppServer";
import DatabaseService from "./Services/DatabaseService";
import {IRepository} from "./Interfaces/IRepository";

import EchoController from "./Controllers/EchoController";
import UserRepository from "./Repositories/UserRepository";

const server: AppServer = new AppServer();

// Create Services
// Database Service

// Database config
const dbConfig = {
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 5432,
    "database": process.env.DB_NAME || 'db',
    "user": process.env.DB_USER || 'postgres'
}

// const db: DatabaseService = new DatabaseService(dbConfig)
//     .withRepositories([
//         new UserRepository("users")
//     ]);

// Inject Controllers
server.withRestControllers([

]);

server.withWsControllers([
    new EchoController()
]);

// Start service
server.start();