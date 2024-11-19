import WsSessionService from "Services/WsSessionService";
import { Data } from "ws";
import WebSocket from "ws";


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
    const uuid = json.uuid;

    if(!uuid) {
        ws.send("Missing uuid: Closing connection")
        ws.close();
        return true;
    }

    if(!wsSessionService.validateSession(uuid)) {
        ws.send("Invalid session key");
        ws.close();
        return true;
    }      

    return false;

}