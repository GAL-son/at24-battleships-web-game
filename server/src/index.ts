
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
import GameRepository from './Repositories/GameRepository';
import { getMiddlewareWithSession } from './Middleware/AuthMiddleware';
import GamesController from './Controllers/GamesController';
import GameSessionService from 'Services/GameSessionService';
import GameController from './Controllers/GameController';
import GameService from './Services/GameService';
import WsSessionService from './Services/WsSessionService';

const server: AppServer = new AppServer();

// Create Services


// Database Service
const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users"),
        new GameRepository("games")
    ]);

const gameService: GameService = new GameService();
const sessionService: SessionService = new SessionService();
const wsSessionService = new WsSessionService();

// Inject Controllers
server.withRestControllers([
    new UserController(db.repository<UserRepository>('users'), sessionService),
    new SessionController(db.repository<UserRepository>('users'), wsSessionService, sessionService),
    new GamesController(db.repository<GameRepository>('games'), getMiddlewareWithSession(sessionService))
]);

server.withWsControllers([
    new EchoController(),
    new GameController(gameService, wsSessionService),
]);

// Start service
server.start();