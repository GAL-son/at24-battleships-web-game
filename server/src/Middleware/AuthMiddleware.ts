import { NextFunction, Request, RequestHandler, Response } from "express";
import SessionService from "../Services/SessionService";
import JWTService from "../Services/JWTService";

export const getMiddlewareWithSession = (sessionService: SessionService) => {
    return (request: Request, response: Response, next: NextFunction)=> {
        const token =  request.header('Authorization')?.replace('Bearer ', '');      
        
        if(!token) {
            response.status(401).send("Missing token");
        } else {
            const session = sessionService.getSession(token);    

            if(session) {
                try {
                    const jwt = new JWTService();
                    jwt.verifyToken(token);
                } catch (error) {
                    sessionService.deleteSession(token);
                    return response.status(401).send("Session has expired");
                }
                request.body['session'] = session;               
                next();
            } else {
                response.status(401).send("Authorization failed");
            }
        }    
    }
}