import { IGameUpdateData } from "Models/GameCommunication";

export default interface IPlayer {    
    updateState(update: IGameUpdateData): void;
    isReady(): boolean;
}