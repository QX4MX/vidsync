import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { AuthController } from '../controller/authentication.controller';

export class UserRoutes {

    router: Router;
    public authController: AuthController = new AuthController();
    public userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {
        this.router.get("/new", this.userController.newUser);
        this.router.put("/update", this.authController.verifyJwtToken, this.userController.updateUser);
        this.router.get("/auth", this.authController.verifyJwtToken, this.userController.getUser);
    }
}