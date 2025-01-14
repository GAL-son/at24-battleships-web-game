import Field from "../src/Logic/Game/Field";
import Board from "../src/Logic/Game/Board";

describe("Test Board", () => {
    const boardSize = {x: 10, y: 10};
    const board: Board = new Board(boardSize);

    // TJ_11
    it("Should access field in bounds", () => {
        const coordinates = {x: 2, y: 0};
        const field: Field = board.getField(coordinates.x, coordinates.y);
        
        expect(field).toBeInstanceOf(Field);
    })
    
    // TJ_12
    it("Should throw when accessing out of bounds field", () => {
        const coordinates = {x: 3, y: -1};
        try {
            board.getField(coordinates.x, coordinates.y);

            // faile the test when throws nothing
            expect(true).toEqual(false);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toEqual("Out of bounds");
        }
    })
})