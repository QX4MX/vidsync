import { Router } from 'express';

import { RoomController } from '../controller/room.controller';
import { AuthController } from '../controller/authentication.controller';
import { youtubeapi } from '../../ytapi';

export class RoomRoutes {
    public router: Router;
    public roomController: RoomController;
    public authController: AuthController;

    /**
     * Creates an instance of RoomRoutes.
     * @param ytApi - Youtube API
     */
    constructor(private ytApi: youtubeapi) {
        this.roomController = new RoomController(this.ytApi);
        this.authController = new AuthController();
        this.router = Router();
        this.routes();
    }
    /**
     * Sets up room routes
     */
    routes() {
        this.router.get(
            '/create',
            this.authController.verifyJwtToken,
            this.roomController.createRoom
        );
        this.router.get(
            '/set-video/:videoID',
            this.authController.auth_dcbot,
            this.roomController.createRoomWithVideo
        );
        this.router.get(
            '/set-playlist/:listId',
            this.authController.auth_dcbot,
            this.roomController.createRoomWithPlaylist
        );
        this.router.get(
            '/:id',
            this.authController.verifyJwtToken,
            this.roomController.getRoom
        );
        this.router.put(
            '/:id',
            this.authController.verifyJwtToken,
            this.roomController.updateRoom
        );
    }
}
