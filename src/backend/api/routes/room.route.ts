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
        this.router.get("/", this.roomController.getPublicRooms);
        this.router.get("/create/:id", this.roomController.createOneHourRoom);
        this.router.get("/private", this.authController.verifyGoogleToken, this.roomController.getOwnRooms);
        this.router.get("/:id", this.roomController.getRoom);
        this.router.post("/", this.authController.verifyGoogleCaptchaToken, this.roomController.createRoom);
        this.router.post("/create", this.authController.verifyGoogleToken, this.roomController.createOwnRoom);
        this.router.put("/:id", this.roomController.updateRoom);
        this.router.delete("/:id", this.authController.verifyGoogleToken, this.roomController.deleteRoom);
    }
}