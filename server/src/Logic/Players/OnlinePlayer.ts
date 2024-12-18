import { IUserModel } from "Database/Models/IUserModel";
import IPlayer from "Logic/Interfaces/IPlayer";
import { ServerMessage } from "Resources/Messages/Types/WsServerMessages";


export default class OnlinePlayer implements IPlayer {
    name: string;
    score: number;
    connectionId: string;
    didSetShips = false;

    messageHandler;

    constructor(
        user: IUserModel, 
        connectionId: string, 
        messageHandler: (connectionId: string, message: ServerMessage) => void
    ){
        this.name = user.name;
        this.score = user.score;
        this.connectionId = connectionId;

        this.messageHandler = messageHandler;
    }

    sendMessage(message: ServerMessage): void {
        this.messageHandler(this.connectionId, message);
    }

    isReady(): boolean {
        return this.didSetShips;
    }

    setReady(ready: boolean): void {
        this.didSetShips = true;
    }



}