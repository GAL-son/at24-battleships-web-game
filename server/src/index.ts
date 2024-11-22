
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from "./Global/Services/DatabaseService";


import EchoController from "./Ws/Controllers/EchoController";
import UserRepository from "./Global/Database/Repositories/UserRepository";
import UserController from './Rest/Controllers/UserController';
import SessionController from './Rest/Controllers/SessionController';
import SessionService from './Global/Services/SessionService';
import GameRepository from './Global/Database/Repositories/GameRepository';
import { getMiddlewareWithSession } from './Rest/Middleware/AuthMiddleware';
import GamesController from './Rest/Controllers/GamesController';
import GameSessionService from 'Global/Services/GameSessionService';
import GameController from './Ws/Controllers/GameController';
import GameService from './Global/Services/GameService';
import WsSessionService from './Global/Services/WsSessionService';

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