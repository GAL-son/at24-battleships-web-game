import JWTService from "../src/Services/JWTService";
import jwt from "jsonwebtoken";

describe("Test JWT service", () => {
    const oldEnv = process.env;
    beforeEach(() => {
        process.env = {
            ...oldEnv,
            JWT_KEY: "testKey"
        };
    })

    afterAll(() => {
        process.env = oldEnv;
    })

    // TJ_15
    it("Should throw an error when JWT_KEY variable is not set" ,() => {
        process.env.JWT_KEY = undefined;
        try {
            const jwt = new JWTService();
            
            jwt.verifyToken("TEST TOKEN");

            // Fail the test if no error is thrown
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toEqual("Missing jwt key");
        }
    })

    it("Should create valid jwt token", () => {  
        const jwtService = new JWTService();
        const payload = {
            testData: "data"
        }

        const token = jwtService.createToken(payload);
        const isValid = jwt.verify(token, "testKey");
        expect(isValid).toBeTruthy();
    })

})