import DatabaseService from "../src/Services/DatabaseService";
import AppServer from "../src/AppServer";
import UserRepository from "../src/Database/Repositories/UserRepository";
import GameRepository from "../src/Database/Repositories/GameRepository";
import { createApp } from "../src/createApp";
import { config } from "../src/config";
import request from 'supertest'
import { IGameModel } from "Database/Models/IGameModel";


describe("test /api/games Endpoints", () => {
    let token = "";
    let testapp: AppServer;
    const testUser = {
        name: "TestUser",
        password: "TESTPASSWORD",
        email: "test@mail.com"
    }

    const testUser2 = {
        name: "TestUser2",
        password: "testPasswg",
        email: "mail@mail.com"
    }

    beforeAll(async () => {
        const testdb: DatabaseService = new DatabaseService(config.db).withRepositories([
            new UserRepository("users", config.db.schema, config.db.usersTable),
            new GameRepository("games", config.db.schema, config.db.gamesTable)
        ]);
        testapp = createApp(testdb);

        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send(testUser);

        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: testUser.name,
                password: testUser.password
            });

        token = response.body.token;

        // Create game for user
        // Create Second user
        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send(testUser2);

        // Save Game
        await testdb.repository<GameRepository>("games").saveGame(
            {
                gameId: 100000,
                player1Name: testUser2.name,
                player2Name: testUser.name,
                player1Winner: false,
                length: 45
            } as IGameModel
        )
    });

    it("Should be able to see all games", async () => {
        const response = await request(testapp.getRestServer())
            .get('/api/games/all')
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    })

    it("Should be able to see all games for user", async () => {
        const response = await request(testapp.getRestServer())
            .get('/api/games/user/' + testUser.name)
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((element: any) => {
            expect(element.player1name === testUser.name || element.player2name === testUser.name).toBeTruthy();
        });
    })

    afterAll(async () => {
        await request(testapp.getRestServer())
            .delete('/api/users/user/' + testUser.name + "/delete")
            .set("Authorization", "Bearer " + token);

        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: testUser2.name,
                password: testUser2.password,
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + testUser2.name + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.server.close();
    })
})