import { FieldPosition } from "Logic/Game/FieldPosition";
import { ShipSetup } from "Logic/IGameSetup";



interface IGameUpdateData {
    enemyMove: IMoveData;
    wasHit: boolean;
}

interface IMoveData {
    moveName: string;
    moveCoordinates: {
        x: number,
        y: number
    }
}

interface IShipPlacement {
    shipSize: number;
    position: FieldPosition,
    vertically: boolean
}

export { IMoveData, IGameUpdateData, IShipPlacement}