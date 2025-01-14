import Field from "../src/Logic/Game/Field";
import Ship from "../src/Logic/Game/Ship";

describe("Test field", () => {
    const field: Field = new Field();

    // TJ_13
    it("Should be empty by default", () => {
        expect(field.hasShip()).toEqual(false);
    });

    // TJ_14
    it("Should not be hit by default", () => {
        expect(field.wasHit).toEqual(false);
    })
})

