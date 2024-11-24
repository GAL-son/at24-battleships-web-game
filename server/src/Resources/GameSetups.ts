import { IGameSetup } from "Logic/IGameSetup";
import { defaultShipSetup } from "./DefaultShipSetup";

const defaultGameSetup: IGameSetup = {
    boardSize: {x: 10, y: 10},
    shipSizes: defaultShipSetup
}

const testGameSetup: IGameSetup = {
    boardSize: {x: 10, y: 10},
    shipSizes: {
        2: 1
    }
}

export {
    defaultGameSetup,
    testGameSetup,
}
