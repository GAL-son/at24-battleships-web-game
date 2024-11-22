import { assert } from "console";
import Ship from "./Ship";

export default class Field {
    ship?: Ship;
    shipPart?: number;
    canHostShip: boolean = true;
    wasHit: boolean = false;

    constructor() {
        this.wasHit = false;
    }

    public hasShip(): boolean {
        return this.ship !== undefined && this.shipPart !== undefined;
    }

    public getShip() {
        return this.ship;
    }

    public lockField() {
        this.canHostShip = false;
    }

    public hit() {        
        if(this.hasShip() && this.ship !== undefined && this.shipPart !== undefined) {
            console.log("HIT SHIP");
            
            this.ship.hit(this.shipPart);
            return this.ship;
        }
        
        console.log("HIT WATTER");
        return false;        
    }

    public clearShip() {
        this.ship = undefined;
        this.shipPart = undefined;
        this.canHostShip = true;
    }

    public putShip(ship: Ship, shipPart: number) {
        this.ship = ship;
        this.shipPart = shipPart;
        this.lockField();
    }
}