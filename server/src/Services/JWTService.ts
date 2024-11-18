import jwt from "jsonwebtoken";

class JWTService {

    key: string;

    constructor() {
        if(!process.env.JWT_KEY) {
            throw new Error("Missing JWT Key");
        } else {
            this.key = process.env.JWT_KEY;
        }       
    }

    public createToken(payload: any, expiresMinutes?: number) {
        const token = jwt.sign(payload, this.key, {
            'expiresIn': expiresMinutes + 'm'
        })

        return token;
    }

}

export default JWTService;