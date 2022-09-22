import { createServer, Server } from 'http';
import * as express from 'express';
import * as compression from 'compression';
import * as cors from 'cors';
import * as path from 'path';
import { mongooseDB } from './api/Database';
import { RoomRoutes } from './api/routes/room.route';
import { youtubeapi } from './ytapi';
import { UserRoutes } from './api/routes/user.route';
import { SocketServer } from './socket/SocketServer';
import { PORT } from './util/secret';


class AppServer {
    private app: express.Application = express();
    private server: Server;
    private router: any = express.Router();
    private socketServer: SocketServer;
    private db: mongooseDB;
    private ytApi: youtubeapi;

    private apiroomRoutes: RoomRoutes;
    private apiuserRoutes: UserRoutes;



    constructor() {
        this.app = express();
        this.config();
        //API
        this.routes();
    }

    private config() {
        this.app.set("port", PORT || 4000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cors());

        this.server = createServer(this.app);
        this.ytApi = new youtubeapi();
        this.db = new mongooseDB();
        this.socketServer = new SocketServer(this.server, this.ytApi);
    }

    private routes() {
        this.app.get('*.*', express.static(path.join(__dirname, '../frontend/')));
        this.app.use("/api/user", new UserRoutes().router);
        this.app.use("/api/room", new RoomRoutes(this.ytApi).router);
        // Default route
        this.app.all('*', function (req, res) {
            res.status(200).sendFile('/', { root: path.join(__dirname, '../frontend/') });
        });

    }

    public listen(): void {
        this.server.listen(this.app.get("port"), () => {
            console.log('Running server on port %s', this.app.get("port"));
        });
    }
}

let appserver = new AppServer();
appserver.listen();