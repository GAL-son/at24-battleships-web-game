import { ServerMessage } from "Ws/Messages/Types/WsServerMessages";

export default interface IPlayer {    
    name: string;
    score: number;

    sendMessage(message: ServerMessage): void;    
    isReady(): boolean;
    setReady(ready: boolean): void;

    
}