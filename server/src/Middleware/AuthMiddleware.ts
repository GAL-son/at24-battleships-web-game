import { NextFunction, Request, RequestHandler, Response } from "express";
import SessionService from "../Services/SessionService";
import jwt from 'jsonwebtoken';
import { config } from "../config";

export const getMiddlewareWithSession = (sessionService: SessionService) => {

    const key = config.jwtKey;
    if(!key) {
        throw new Error("Missing JWT Key")
    }

    return (request: Request, response: Response, next: NextFunction)=> {
        const token =  request.header('Authorization')?.replace('Bearer ', '');      

        if(!token) {
            response.status(401).send("Missing token");
        } else {
            const session = sessionService.getSession(token);

            if(session) {
                try {
                    jwt.verify(token, key);
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