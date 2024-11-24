import { FieldPosition } from "./FieldPosition";

type MoveData = {
    moveName?: string;
    moveCoordinates: {
        x: number,
        y: number
    }
}

type ShipPlacement = {
    shipSize: number;
    position: FieldPosition,
    vertically: boolean
}

export {MoveData, ShipPlacement};
