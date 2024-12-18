import WebSocket, { WebSocketServer } from 'ws';
import { WebSocketWrapper } from '../Logic/Interfaces/WebSocketWrapper';

export interface IWsController {
    onConnection(wsw: WebSocketWrapper): void;
    onMessage(wsw: WebSocketWrapper, message: WebSocket.Data): void;
    onClose(wss: WebSocketWrapper, code: number): void;
    onError(wsw: WebSocketWrapper, error: Error): void;
}