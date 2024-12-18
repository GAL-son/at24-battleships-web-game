import { WebSocketWrapper } from "Logic/Interfaces/WebSocketWrapper"
import ISessionModel from "Repositories/DataModels/ISessionModel"

export type WsSession = {
    uuid: string,
    session: ISessionModel,
    expires: number,
}