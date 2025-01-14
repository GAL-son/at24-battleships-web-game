
import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './config';

import DatabaseService from './Services/DatabaseService';

import UserRepository from './Database/Repositories/UserRepository';
import GameRepository from './Database/Repositories/GameRepository';
import { createApp } from './createApp';

// Database Service
const db: DatabaseService = new DatabaseService(config.db)
    .withRepositories([
        new UserRepository("users", config.db.schema, config.db.usersTable),
        new GameRepository("games", config.db.schema, config.db.gamesTable)
    ]);

const server = createApp(db);

// Start service
server.start();