
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from "./Services/DatabaseService";
import {IRepository} from "./Interfaces/IRepository";

import EchoController from "./Controllers/EchoController";
import UserRepository from "./Repositories/UserRepository";

const server: AppServer = new AppServer();

// Create Services
// Database Service

// Database config

const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users")
    ]);

db.repository<UserRepository>('users').getUsers().then(console.log);

// Inject Controllers
server.withRestControllers([

]);

server.withWsControllers([
    new EchoController()
]);

// Start service
server.start();