import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import * as http from "http";

import { config } from './config';
import RestController from 'Interfaces/RestController';
import WsController from 'Interfaces/WsController';

class AppServer {
    private restServer: express.Application;
    private webSocketServer: WebSocketServer;
    private server: http.Server;

    constructor() {
        this.restServer = express();
        this.server = http.createServer(this.restServer);
        this.webSocketServer = new WebSocket.Server({server: this.server});        
    }

    public start() {
        this.server.listen(config.port, () => {
            console.log("Server is now running at http://localhost:" + config.port);
        });
    }

    public withRestControllers(restControllers: RestController[]) {
        restControllers.forEach(controller => {
            this.restServer.use('/', controller.router);
        });
    } 

    public withWsControllers(wsControllers: WsController[]) {
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