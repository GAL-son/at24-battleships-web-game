import { IGameSetup } from "Logic/IGameSetup";
import { defaultShipSetup } from "./DefaultShipSetup";

export const defaultGameSetup: IGameSetup = {
    boardSize: {x: 10, y: 10},
    shipSizes: defaultShipSetup
}