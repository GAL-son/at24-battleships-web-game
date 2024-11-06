import express from 'express';
import WebSocket from 'ws';
import * as http from "http";
import { config } from './config';

class AppServer {
    public restServer: express.Application;
    public webSocketServer: WebSocket.Server;
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


}

export default AppServer;