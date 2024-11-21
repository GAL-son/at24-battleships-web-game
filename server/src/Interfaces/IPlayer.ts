import { IGameUpdateData } from "Messages/Types/PlayerMessages";

export default interface IPlayer {    
    updateState(update: IGameUpdateData): void;
    isReady(): boolean;
}