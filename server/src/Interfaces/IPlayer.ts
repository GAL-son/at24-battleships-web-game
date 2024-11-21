import { IGameUpdateData } from "Messages/Types/WsPlayerMessages";

export default interface IPlayer {    
    updateState(update: IGameUpdateData): void;
    isReady(): boolean;
}