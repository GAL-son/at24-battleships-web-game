export default class Ship {
    parts: boolean[];

    constructor(size: number) {
        this.parts = new Array(size).fill(false);
    }

    public hit(part: number) {
        if(part > this.parts.length) {
            throw new Error("Cant hit outside of the ship");
        }

        this.parts[part] = true;
    }

    public isDead() {
        return this.parts.reduce((prev, curr) => {return prev && curr});
    }
}