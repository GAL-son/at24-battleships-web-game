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
        console.log("AUTH MIDDLEWARE");

        const token =  request.header('Authorization')?.replace('Bearer ', '');

        console.log(token);
        

        if(!token) {
            response.status(401).send("Missing token");
        } else {
            const session = sessionService.validateSession(token);

            if(session) {
                next();
            } else {
                response.status(401).send("Authorization failed");
            }

        }    
    }
}