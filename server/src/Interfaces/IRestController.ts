import { Router } from "express";

export interface IRestController {
    path: string;
    router: Router;
}

export default IRestController;