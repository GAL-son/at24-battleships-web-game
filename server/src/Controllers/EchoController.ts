import WebSocket from "ws";

import {IWsController} from "Interfaces/IWsController";
import Board from "../Logic/Game/Board";
import Ship from "../Logic/Game/Ship";
import { IShipPlacement } from "Messages/Types/PlayerMessages";

class EchoController implements IWsController {

    constructor() {
        // const board = new Board({ x:10, y:10});
        // const ships = [
        //     new Ship(3),
        //     new Ship(1)
        // ];

        // const placement: IShipPlacement[] = [
        //     {shipSize: 3, position: {x: 2, y: 2}, vertically: true},
        //     {shipSize: 1, position: {x: 3, y: 3}, vertically: true},
        // ];

        // board.setShips(ships, placement);
    }

    onConnection(ws: WebSocket): void {
        console.log("Connected");
        ws.send("Connected");
    }
    onMessage(ws: WebSocket, message: WebSocket.Data): void {
        console.log("Message: " + message);
        ws.send("Echo: " + message);
    }
    onClose(ws: WebSocket, code: number): void {
        console.log("Connection closed")
    }
    onError(Ws: WebSocket, error: Error): void {
        console.error("Connection Error")
    }
}

export default EchoController;