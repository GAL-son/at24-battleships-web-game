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
    const userdata = {
        name: "testtesttest9",
        password: "TESTPASSWORD",
        email: "test@mail.com"
    }

    beforeAll(async () => {
        const testdb: DatabaseService = new DatabaseService(config.db).withRepositories([
            new UserRepository("users"),
            new GameRepository("games")
        ]);
        testapp = createApp(testdb);

        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send(userdata);

        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: userdata.name,
                password: userdata.password
            });

        token = response.body.token;

        // Create game for user
        // Create Second user
        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send({
                name: "testusertest1",
                password: "testPasswg",
                email: "mail@mail.com"
            });

        // Save Game
        await testdb.repository<GameRepository>("games").saveGame(
            {
                gameId: 100000,
                player1Name: "test3",
                player2Name: userdata.name,
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
            .get('/api/games/user/' + userdata.name)
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((element: any) => {               
            expect(element.player1name === userdata.name || element.player2name === userdata.name).toBeTruthy();
        });
    })

    afterAll(async () => {
        await request(testapp.getRestServer())
            .delete('/api/users/user/' + userdata.name + "/delete")
            .set("Authorization", "Bearer " + token);

        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: "testusertest1",
                password: "testPasswg",
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + "testusertest1" + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.server.close();
    })
})