import { config } from "../src/config";
import DatabaseService from "../src/Services/DatabaseService"
import UserRepository from "../src/Database/Repositories/UserRepository";
import GameRepository from "../src/Database/Repositories/GameRepository";
import { createApp } from "../src/createApp";
import request from 'supertest'
import AppServer from "AppServer";

describe('Test User endpoints with correct user', () => {
    let testdb: DatabaseService;
    let token = "";
    let testapp: AppServer;
    const userdata = {
        name: "IntegrationTestUser",
        password: "TESTPASSWORD",
        email: "test@mail.com"
    }

    beforeAll(async () => {
        testdb = new DatabaseService(config.db).withRepositories([
            new UserRepository("users", config.db.schema, config.db.usersTable),
            new GameRepository("games", config.db.schema, config.db.gamesTable)
        ]);
        testapp = createApp(testdb);

        // Create Second user
        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send({
                name: "someoneElse",
                password: "testPasswg",
                email: "mail@mail.com"
            });
    });

    it("Should create user and return 201", async () => {
        const result = await request(testapp.getRestServer())
            .post('/api/users/create')
            .send(userdata);

        expect(result.statusCode).toBe(201);
    });

    it("Should be able to login", async () => {
        const result = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: userdata.name,
                password: userdata.password
            });

        expect(result.statusCode).toEqual(201);
        expect(result.body).toHaveProperty('token');

        token = result.body.token;
    })

    it("should be able to see ranking", async () => {
        const result = await request(testapp.getRestServer())
            .get('/api/users')
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(200);
    })

    it("should be able to read own account data", async () => {
        const result = await request(testapp.getRestServer())
            .get('/api/users/user/' + userdata.name)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(200);
        expect(result.body.name).toEqual(userdata.name);
    })

    it("should be able to update his email and password", async () => {
        const newEmail = 'newEmail@email.com';
        const result = await request(testapp.getRestServer())
            .patch('/api/users/user/' + userdata.name + "/update")
            .set("Authorization", "Bearer " + token)
            .send({ email: newEmail });
        expect(result.statusCode).toBe(204);

        const resultCheck = await request(testapp.getRestServer())
            .get('/api/users/user/' + userdata.name)
            .set("Authorization", "Bearer " + token);

        expect(resultCheck.body.email).toEqual(newEmail);
    })

    it("should not be able to update someone elses email and password", async () => {
        const newEmail = 'newEmail@email.com';
        const result = await request(testapp.getRestServer())
            .patch('/api/users/user/' + "someoneElse" + "/update")
            .set("Authorization", "Bearer " + token)
            .send({ email: newEmail });
        expect(result.statusCode).toBe(403);
    })

    it("Should not be able to delete other users", async () => {
        const result = await request(testapp.getRestServer())
            .delete('/api/users/user/' + "someoneElse" + "/delete")
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(403);
    })

    it("Should be able to delete own accound", async () => {
        const result = await request(testapp.getRestServer())
            .delete('/api/users/user/' + userdata.name + "/delete")
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(204);
    })

    afterAll(async () => {
        // Log in and delete other user
        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: "someoneElse",
                password: "testPasswg",
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + "someoneElse" + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.end();
        testdb.close();

    })
})

describe("Test User endpoints with incorrect user", () => {
    let testdb: DatabaseService;
    let token = "fakeToken";
    let testapp: AppServer;
    const userdata = {
        name: "IncorrectName",
        password: "IncorrectPassword",
        email: "IncorrectMail"
    }

    beforeAll(async () => {
        testdb = new DatabaseService(config.db).withRepositories([
            new UserRepository("users", config.db.schema, config.db.usersTable),
            new GameRepository("games", config.db.schema, config.db.gamesTable)
        ]);
        testapp = createApp(testdb);

        // Create Second user
        await request(testapp.getRestServer())
            .post('/api/users/create')
            .send({
                name: "someoneElse",
                password: "testPasswg",
                email: "mail@mail.com"
            });
    });

    it("Should not be able to create account with incorrect data", async () => {
        const result = await request(testapp.getRestServer())
            .post('/api/users/create')
            .send(userdata);

        expect(result.statusCode).toBe(400);
    });

    it("Should not be able to use name thats taken", async () => {
        const result = await request(testapp.getRestServer())
            .post('/api/users/create')
            .send({
                ...userdata,
                name: "someoneElse"
            });

        expect(result.statusCode).toBe(400);
    })

    it("Should not access user information with invalid token", async () => {
        const result = await request(testapp.getRestServer())
            .get('/api/users/user/' + userdata.name)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(401);

    })

    afterAll(async () => {
        // Log in and delete other user
        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: "someoneElse",
                password: "testPasswg",
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + "someoneElse" + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.end();
        testdb.close();

    })
})


describe('Test User endpoints with expired token', () => {
    let testdb: DatabaseService;
    let token = "";
    let testapp: AppServer;
    const userdata = {
        name: "IntegrationTestUserLogOut",
        password: "TESTPASSWORD",
        email: "test@mail.com"
    }

    beforeAll(async () => {
        testdb = new DatabaseService(config.db).withRepositories([
            new UserRepository("users", config.db.schema, config.db.usersTable),
            new GameRepository("games", config.db.schema, config.db.gamesTable)
        ]);
        testapp = createApp(testdb);

        // Create Second user
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

    it('Should be able to log out', async () => {

        const result = await request(testapp.getRestServer())
            .post('/api/session/delete')
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toEqual(200);
    })

    it("O token should be no longer valid", async () => {
        const result = await request(testapp.getRestServer())
            .get('/api/users/user/' + userdata.name)
            .set("Authorization", "Bearer " + token);

        expect(result.statusCode).toBe(401);

    })

    afterAll(async () => {
        // Log in and delete other user
        const response = await request(testapp.getRestServer())
            .post('/api/session/create')
            .send({
                name: userdata.name,
                password: userdata.password
            });

        token = response.body.token;

        await request(testapp.getRestServer())
            .delete('/api/users/user/' + userdata.name + "/delete")
            .set("Authorization", "Bearer " + token);
        testapp.end();
        testdb.close();

    })

})