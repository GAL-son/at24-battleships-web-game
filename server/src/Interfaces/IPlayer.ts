import { IGameUpdateData } from "Ws/Messages/Types/WsPlayerMessages";

export default interface IPlayer {    
    updateState(update: IGameUpdateData): void;
    isReady(): boolean;
}