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
        this.router.get("/create", this.authController.verifyJwtToken, this.roomController.createRoom);
        this.router.get("/single-video/:videoID", this.roomController.createSingleVideoRoom);
        this.router.get("/:id", this.authController.verifyJwtToken, this.roomController.getRoom);
        this.router.put("/:id", this.authController.verifyJwtToken, this.roomController.updateRoom);
    }
}