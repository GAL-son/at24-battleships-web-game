import WsSessionService from "Services/WsSessionService";
import { Data } from "ws";
import WebSocket from "ws";
import typia from "typia";
import { GameSessionMessage } from "Messages/Types/WsPlayerMessages";


export const WsAuthMiddleware = (wsSessionService: WsSessionService, ws: WebSocket, data: Data): boolean => {
    const sendError = (ws: WebSocket, error: Error) => {
        ws.send(error.message);
    }

    let json;
    try {
        json = JSON.parse(data.toString());
    } catch (error) {
        if(error instanceof Error) {
            sendError(ws, error);
        }
    } 
       

    if(!typia.is<GameSessionMessage>(json)) {
        ws.send("Missing sessionKey: Closing connection")
        ws.close();
        return true;
    }

    const key = (json as GameSessionMessage).sessionKey;

    if(!wsSessionService.validateSession(key)) {
        ws.send("Invalid session key");
        ws.close();
        return true;
    }      

    return false;
}