import * as compression from 'compression';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

import { createServer, Server } from 'http';

import { PORT } from './util/secret';
import { mongooseDB } from './api/Database';
import { RoomRoutes } from './api/routes/room.route';
import { UserRoutes } from './api/routes/user.route';
import { SocketServer } from './socket/SocketServer';
import { youtubeapi } from './ytapi';

class AppServer {
    private app: express.Application = express();
    private server: Server;
    private ytApi: youtubeapi;

    /**
     * Creates an instance of AppServer.
     */
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    /**
     * Sets up server config
     */
    private config() {
        this.app.set('port', PORT || 4000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cors());

        this.server = createServer(this.app);
        this.ytApi = new youtubeapi();
        new mongooseDB();
        new SocketServer(this.server, this.ytApi);
    }

    /**
     * Sets up routes
     */
    private routes() {
        this.app.get(
            '*.*',
            express.static(path.join(__dirname, '../frontend/'))
        );
        this.app.use('/api/user', new UserRoutes().router);
        this.app.use('/api/room', new RoomRoutes(this.ytApi).router);
        // Default route
        this.app.all('*', function (req, res) {
            res.status(200).sendFile('/', {
                root: path.join(__dirname, '../frontend/'),
            });
        });
    }

    /**
     * Starts server
     */
    public listen(): void {
        this.server.listen(this.app.get('port'), () => {
            console.log('Running server on port %s', this.app.get('port'));
        });
    }
}

new AppServer().listen();
