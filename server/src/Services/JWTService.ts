import jwt from "jsonwebtoken";

class JWTService {
    public createToken(payload: any, expiresMinutes?: number) {
        const key: string | undefined = process.env.JWT_KEY;

        if(!key) {
            throw new Error("Missing jwt key");
        }

        const token = jwt.sign(payload, key, {
            'expiresIn': expiresMinutes + 'm'
        })

        return token;
    }

}

export default JWTService;