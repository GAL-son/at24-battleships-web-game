import jwt from "jsonwebtoken";

class JWTService {

    key: string | undefined;

    constructor() {
        this.key = process.env.JWT_KEY;
    }

    public createToken(payload: any, expiresMinutes: number = 30) {
        if(!this.key) {
            throw new Error("Missing jwt key");
        }

        const token = jwt.sign(payload, this.key, {
            'expiresIn': expiresMinutes + 'm'
        })

        return token;
    }

    public verifyToken(token: string) {

        if(!this.key) {
            throw new Error("Missing jwt key");
        }

        return jwt.verify(token, this.key);
    }

    

}

export default JWTService;