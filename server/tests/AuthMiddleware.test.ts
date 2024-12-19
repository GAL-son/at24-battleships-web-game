import { getMiddlewareWithSession } from "../src/Middleware/AuthMiddleware";
import SessionService from "../src/Services/SessionService";
import JWTService from "../src/Services/JWTService";
import {createRequest, createResponse} from 'node-mocks-http'

describe("Test AuthMiddleware", () => {
    const oldEnv = process.env;
    process.env = {...oldEnv, JWT_KEY: "testKey"};
    const jwt = new JWTService();
    const userData = {
        name: "test",
        email: "test@mail.com",
        score: 6969
    }    
    const testToken = jwt.createToken(userData);

    const mockSessionService = jest.fn().mockImplementation(() => {
        return {
            ...new SessionService(),
            getSession: jest.fn((token: string) => {                
                if(token == testToken) {
                    return {
                        token: testToken,
                        data: userData
                    }
                }
            })
        }
    });
    const authMiddleware = getMiddlewareWithSession(mockSessionService());
    const spyNext = jest.fn(() => {});

    afterAll(() => {
        process.env = oldEnv;
    })

    it("When token is missing return response with 401 status code", () => {
        const mockRequest = createRequest();
        const mockResponse = createResponse();
        authMiddleware(mockRequest, mockResponse, spyNext);
        expect(mockResponse.statusCode).toBe(401);
    });
    
    it("When request has correct token it should call next function", () => {
        const mockRequest = createRequest({
            headers: {
                authorization: "Bearer " + testToken
            }
        });
        const mockResponse = createResponse();
        authMiddleware(mockRequest, mockResponse, spyNext);

        expect(spyNext.mock.calls.length).toBe(1);
    })

    it("With invalid token middleware should return response with 401 status code", () => {
        const mockRequest = createRequest({
            headers: {
                authorization: "Bearer invalidToken"
            }
        });
        const mockResponse = createResponse();
        authMiddleware(mockRequest, mockResponse, spyNext);
        expect(mockResponse.statusCode).toBe(401);
    });
});