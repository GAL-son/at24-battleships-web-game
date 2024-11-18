import express, { ErrorRequestHandler } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import * as http from "http";
import cors from 'cors';

import { config } from './config';
import {IRestController} from 'Interfaces/IRestController';
import {IWsController} from 'Interfaces/IWsController';
import morgan from 'morgan';
import bodyParser from 'body-parser';

class AppServer {
    private restServer: express.Application;
    private webSocketServer: WebSocketServer;
    private server: http.Server;

    constructor() {
        this.restServer = express();
        this.server = http.createServer(this.restServer);
        this.webSocketServer = new WebSocket.Server({server: this.server}); 
            
        this.restServer.use(            
            cors(config.corsOptions),
            morgan('dev'),
            bodyParser.json()
        );
        this.restServer.use(
            (err: any, req: any, res: any, next: any) => {
            console.error(err.stack);
            next(err);
          });
    }

    public start() {
        this.server.listen(config.port, () => {
            console.log("Server is now running at http://localhost:" + config.port);
        });
    }

    public withRestControllers(restControllers: IRestController[]) {
        restControllers.forEach(controller => {
            controller.router.stack.forEach((l: any) => console.log("/api" + l.route?.path, l.route?.methods))
            
            this.restServer.use('/api', controller.router);
        });       
        
    } 

    public withWsControllers(wsControllers: IWsController[]) {
        this.webSocketServer.on('connection', (ws: WebSocket) => {
            // onConnection 
            wsControllers.forEach(controller => {
                controller.onConnection(ws);
            });

            
            // onMessage
            ws.on('message', (message) => {
                wsControllers.forEach(controller => {
                    controller.onMessage(ws, message);
                });
            });

            //onError
            ws.on('error', (ws: WebSocket, error: Error) => {
                wsControllers.forEach(controller => {
                    controller.onError(ws, error);
                });
            });

            //onClose
            ws.on('close', (code: number) => {
                wsControllers.forEach(controller => {
                    controller.onClose(ws, code);
                });
            })
        })
    }


}

export default AppServer;