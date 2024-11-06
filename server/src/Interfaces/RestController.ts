import { Router } from "express";

interface RestController {
    path: string;
    router: Router;
}

export default RestController;