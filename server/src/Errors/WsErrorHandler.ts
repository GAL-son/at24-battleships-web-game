import WebSocket from "ws";

const wsErrorHandler = (ws: WebSocket, error: any) => {
    const msg = (error instanceof Error) ? error.message: error;

    const message = {
        error: msg
    }

    ws.send(JSON.stringify(message));
}

export {
    wsErrorHandler
}