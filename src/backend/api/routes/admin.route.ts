import { Router } from 'express';
import { RoomController } from '../controller/room.controller';
import { AuthController } from '../controller/authentication.controller';
export class RoomRoutes {
    public router: Router;
    public roomController: RoomController = new RoomController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {

    }
}