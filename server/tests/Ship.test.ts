import Ship from "../src/Logic/Game/Ship";

describe("Test Ship", () => {
    // Create ship
    const shipSize = 4;
    const ship: Ship = new Ship(4);

    it("Health points should equal to size", () => {
        expect(ship.getHp()).toEqual(shipSize);
    })

    it("Lose HP point when hit", () => {
        ship.hit(1);
        expect(ship.getHp()).toEqual(shipSize-1);
    })
    
    it("Should throw error when hit outside size", () => {
        try {
            ship.hit(4);

            // faile the test when throws nothing
            expect(true).toEqual(false);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toEqual("Cant hit outside of the ship");
        }        
    })

    it("Should die when all fields are hit", () => {
        ship.hit(0);
        ship.hit(1);
        ship.hit(2);
        ship.hit(3);

        expect(ship.isDead()).toEqual(true);
    })
})