import { ServerMessage } from "Resources/Messages/Types/WsServerMessages";

export default interface IPlayer {    
    name: string;
    score: number;

    sendMessage(message: ServerMessage): void;    
    isReady(): boolean;
    setReady(ready: boolean): void;

    
}