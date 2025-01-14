import WsSessionService from "Services/WsSessionService"
import { WsAuthMiddleware } from "../src/Middleware/WsAuthMiddleware"
import { randomUUID } from "crypto"

describe("Test WsAuthMiddleware", () => {
    const correctSessionKey = randomUUID();
    const mockSessionService = jest.fn().mockImplementation(() => {
        return {
            validateSession: jest.fn((key) => {
                return key === correctSessionKey;
            })
        }
    })
    const mockSend = jest.fn((data): string => {
        return data;
    })

    const mockSocket = jest.fn().mockImplementation(() => {
        return {
            send: mockSend
        }
    })

    beforeEach(() => {
        mockSend.mockClear();
    })

    // TJ_19
    it("Should send error on websocket when not valid JSON message was send", () => {
        const invalidJson = "{invalid: json"
        WsAuthMiddleware(mockSessionService(), mockSocket(), invalidJson);

        const result = mockSend.mock.results[0];
        let correctResult = "";
        try {
            JSON.parse(invalidJson);
        } catch (e) {
            if (e instanceof Error) {
                correctResult = JSON.stringify({
                    error: e.message
                })
            }
        }

        expect(result.value).toEqual(correctResult);
    })

    // TJ_19
    it("Should return correct message when session key is missing", () => {
        const message = JSON.stringify({data: 123});
        WsAuthMiddleware(mockSessionService(), mockSocket(), message);
        
        const result = mockSend.mock.results[0];
        const correctResult = JSON.stringify({error: "'sessionKey' missing!"});
        
        expect(result.value).toEqual(correctResult);
    })
    
    // TJ_19
    it("Should return correct message when invalid session key is provided", () => {
        const message = JSON.stringify({sessionKey: "invalidSessionKey"});
        WsAuthMiddleware(mockSessionService(), mockSocket(), message);

        const result = mockSend.mock.results[0];
        const correctResult = JSON.stringify({error: "Invalid session key"});

        expect(result.value).toEqual(correctResult);
    })

    // WsAuthMiddleware(mockSessionService(), mockSocket() ,"");
})