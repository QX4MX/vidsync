import { Router } from 'express';
import { RoomController } from '../controller/room.controller';
import { AuthController } from '../controller/authentication.controller';
export class AdminRoutes {
    public router: Router;
    public roomController: RoomController = new RoomController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/", this.authController.verifyAdmin, this.roomController.adminGetRooms);
        this.router.delete("/rooms/:id", this.authController.verifyAdmin, this.roomController.adminDeleteRoom);
    }
}