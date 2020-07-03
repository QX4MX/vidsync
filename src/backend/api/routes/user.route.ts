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
        this.router.post("/", this.userController.registerUser);
        this.router.post("/login", this.userController.authenticateUser);
        this.router.get("/auth", this.authController.verifyJwtToken, this.userController.authenticateUserWithToken);
    }
}