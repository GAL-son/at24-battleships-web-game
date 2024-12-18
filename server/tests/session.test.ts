import { config } from "../src/config";
import DatabaseService from "../src/Services/DatabaseService"
import UserRepository from "../src/Database/Repositories/UserRepository";
import GameRepository from "../src/Database/Repositories/GameRepository";
import { createApp } from "../src/createApp";
import request from 'supertest'
import AppServer from "AppServer";

describe("test Rest session", () => {
    let token = "";
    let testapp: AppServer;
    const userdata = {
        name: "IntegrationTestsUser2",
        password: "TESTPASSWORD",
        email: "test@mail.com"
    }

    beforeAll(async () => {
        const testdb: DatabaseService = new DatabaseService(config.db).withRepositories([
            new UserRepository("users", config.db.schema, config.db.usersTable),
            new GameRepository("games", config.db.schema, config.db.gamesTable)
        ]);
        testapp = createApp(testdb);

        // Login with user
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
    });

    it("Should get access to ws sesion key", async () => {
        const result = await request(testapp.getRestServer())
            .post('/api/session/game/create')
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(201);
        expect(result.body).toHaveProperty('sessionKey');
    })

    afterAll(async () => {
        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: userdata.name,
                password: userdata.password,
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + userdata.name + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.server.close();
    })
})