
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import AppServer from "./AppServer";
import DatabaseService from './Services/DatabaseService';
import SessionService from './Services/SessionService';
import WsSessionService from './Services/WsSessionService';
import GameService from './Services/GameService';

import SessionController from './Controllers/SessionController';
import UserController from './Controllers/UserController';
import GamesController from './Controllers/GamesController';
import GameController from './Controllers/GameController';

import UserRepository from './Database/Repositories/UserRepository';
import GameRepository from './Database/Repositories/GameRepository';

import { getMiddlewareWithSession } from './Middleware/AuthMiddleware';
import ScoreService from './Services/ScoreService';

const server: AppServer = new AppServer();

// Create Services


// Database Service
const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users"),
        new GameRepository("games")
    ]);
const scoreService: ScoreService = new ScoreService(db.repository<UserRepository>('users'));
const gameService: GameService = new GameService(db.repository<GameRepository>('games'), scoreService);
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