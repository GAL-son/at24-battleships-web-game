import Field from "./Field";
import { FieldPosition } from "./FieldPosition";
import Ship from "./Ship";
import { IShipPlacement } from "Messages/Types/PlayerMessages";

export default class Board {
    private boardSize: { x: number, y: number };
    private fields: Field[][] = [];

    constructor(size: { x: number, y: number }) {
        this.boardSize = size;

        for (let y = 0; y < size.y; y++) {
            this.fields[y] = [];
            for (let x = 0; x < size.x; x++) {
                this.fields[y][x] = new Field();
            }
        }


        this.printBoard();
    }

    setShips(ships: Ship[], placements: IShipPlacement[]) {
        ships.forEach(ship => {
            // Find Placement
            const placement = placements.find((placement) => {
                return placement.shipSize = ship.parts.length
            });

            // If no possible placement throw
            if (!placement) {
                throw new Error("Invalid Ship Placement");
            }

            // Set ship
            this.setShip(ship, placement.position, placement.vertically);

            // Delete used placemnet
            const index = placements.indexOf(placement);
            if (index !== -1) {
                placements.splice(index, 1);
            }
        });



        // DEBUG 
        this.printBoard();
    }

    setShip(ship: Ship, coordinates: FieldPosition, vertically: boolean) {
        const cellOffset = {
            x: ((!vertically) ? 1 : 0),
            y: ((vertically) ? 1 : 0)
        }

        const shipFields: { x: number, y: number }[] = []
        ship.parts.forEach((part, i) => {
            const partCoordinates = {
                x: coordinates.x + cellOffset.x * i,
                y: coordinates.y + cellOffset.y * i,
            }


            console.log("GET FIELD " + partCoordinates.x + " " + partCoordinates.y);

            const field = this.getField(partCoordinates.x, partCoordinates.y);
            shipFields.push(partCoordinates);
            if (field.hasShip() || field.canHostShip) {
                console.error("Ship overlap");
                throw new Error("This field is occupied. Clear first")
            }
            field.putShip(ship, i);
        });

        this.lockFields(shipFields);
    }

    lockFields(fieldsToLock: { x: number, y: number }[]) {
        fieldsToLock.forEach(fieldToLock => {
            const adjecendFields = [
                { x: fieldToLock.x + 1, y: fieldToLock.y },
                { x: fieldToLock.x - 1, y: fieldToLock.y },
                { x: fieldToLock.x, y: fieldToLock.y + 1 },
                { x: fieldToLock.x, y: fieldToLock.y - 1 },
            ]
            
            

            adjecendFields.forEach(adjecendField => {
                try {
                    const field = this.getField(adjecendField.x, adjecendField.y);
                    field.lockField();
                    console.log("Field " + adjecendField.x + "," + adjecendField.y + " locked");
                    
                } catch (error){}
            });
        });
    }

    clearShips() {
        this.fields.forEach(row => {
            row.forEach(cell => {
                cell.clearShip();
            });
        });
    }

    public getField(x: number, y: number) {
        if (x < 0 || x >= this.boardSize.x || y < 0 || y >= this.boardSize.y) {
            throw new Error("Out of bounds");
        }

        return this.fields[y][x];
    }

    public hitField(x: number, y: number) {
        const field: Field = this.getField(x, y);

        return field.hit();
    }

    printBoard() {
        this.fields.forEach(row => {
            let rowString = "";
            row.forEach(field => {
                if (field.hasShip()) {
                    rowString += "[X]";
                } else {
                    rowString += "[ ]";
                }
            });
            console.log(rowString);
        });
    }
}