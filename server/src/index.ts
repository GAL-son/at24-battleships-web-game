
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from "./Global/Services/DatabaseService";
import SessionService from './Rest/Services/SessionService';
import WsSessionService from './Ws/Services/WsSessionService';
import GameService from './Ws/Services/GameService';

import SessionController from './Rest/Controllers/SessionController';
import EchoController from "./Ws/Controllers/EchoController";
import UserController from './Rest/Controllers/UserController';
import GamesController from './Rest/Controllers/GamesController';
import GameController from './Ws/Controllers/GameController';

import UserRepository from "./Global/Database/Repositories/UserRepository";
import GameRepository from './Global/Database/Repositories/GameRepository';

import { getMiddlewareWithSession } from './Rest/Middleware/AuthMiddleware';

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
    new GameController(gameService, wsSessionService, db.repository<UserRepository>('users')),
]);

// Start service
server.start();