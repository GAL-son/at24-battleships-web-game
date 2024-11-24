import WsSessionService from "Ws/Services/WsSessionService";
import { Data } from "ws";
import WebSocket from "ws";
import typia from "typia";
import { WsSessionMessage } from "Ws/Messages/Types/WsSessionMessage";
import { wsErrorHandler } from "../WsErrorHandler";


export const WsAuthMiddleware = (wsSessionService: WsSessionService, ws: WebSocket, data: Data): boolean => {
    let json;
    try {
        json = JSON.parse(data.toString());
    } catch (error) {
        if(error instanceof Error) {
            wsErrorHandler(ws, error);

        } else {
            wsErrorHandler(ws, "Unknown error");
        }
    }       

    if(!typia.is<WsSessionMessage>(json)) {
        wsErrorHandler(ws, "'sessionKey' missing!");
        return true;
    }

    const key = (json as WsSessionMessage).sessionKey;

    if(!wsSessionService.validateSession(key)) {
        wsErrorHandler(ws, "Invalid session key");
        return true;
    }      

    return false;
}