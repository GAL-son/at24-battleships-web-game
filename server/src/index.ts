import EchoController from "./Controllers/EchoController";
import AppServer from "./AppServer";

const server: AppServer = new AppServer();

// Create Services


// Inject Controllers
server.withRestControllers([

]);

server.withWsControllers([
    new EchoController()
]);

// Start service
server.start();