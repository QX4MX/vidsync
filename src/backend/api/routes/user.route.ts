import { Router } from "express";
import { UserController } from "../controller/user.controller";

export class UserRoutes {

    router: Router;
    public userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {

    }
}