import express from 'express';
import { config } from './config';

class Server {
    public restServer: express.Application;

    constructor() {
        this.restServer = express();
    }

    public start() {
        this.restServer.listen(config.restPort, () => {
            console.log("Rest Server is working on port " + config.restPort);
        })
    }


}

export default Server;