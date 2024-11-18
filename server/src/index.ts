
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from "./Services/DatabaseService";


import EchoController from "./Controllers/EchoController";
import UserRepository from "./Repositories/UserRepository";
import UserController from './Controllers/UserController';
import SessionController from './Controllers/SessionController';
import SessionService from './Services/SessionService';

const server: AppServer = new AppServer();

// Create Services


// Database Service
const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users")
    ]);
const sessionService: SessionService = new SessionService();

// Inject Controllers
server.withRestControllers([
    new UserController(db.repository<UserRepository>('users'), sessionService),
    new SessionController(sessionService, db.repository<UserRepository>('users'))
]);

server.withWsControllers([
    new EchoController()
]);

// Start service
server.start();