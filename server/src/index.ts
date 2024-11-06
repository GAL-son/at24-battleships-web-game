import EchoController from "./Controllers/EchoController";
import AppServer from "./AppServer";

const server: AppServer = new AppServer();
server.withWsControllers([
    new EchoController()
]);

server.start();