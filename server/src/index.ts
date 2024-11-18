
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from "./Services/DatabaseService";
import {IRepository} from "./Interfaces/IRepository";

import EchoController from "./Controllers/EchoController";
import UserRepository from "./Repositories/UserRepository";
import UserController from './Controllers/UserController';

const server: AppServer = new AppServer();

// Create Services
// Database Service

// Database config

const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users")
    ]);

// Inject Controllers
server.withRestControllers([
    new UserController(db.repository<UserRepository>('users'))
]);

server.withWsControllers([
    new EchoController()
]);

// Start service
server.start();