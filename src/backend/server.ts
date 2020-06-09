import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import { SocketEvent } from "./Enum";
import { DB } from './api/Database';
import { RoomRoutes } from './api/routes/room.route';
import { youtubeapi } from './ytapi';



export class AppServer {
    public static readonly PORT: number = 4000;
    private port: any;
    private app: express.Application = express();
    private server: Server;
    private router: any = express.Router();
    private io: SocketIO.Server;
    private db: DB;
    private ytApi: youtubeapi = new youtubeapi();

    private apiroomRoutes: RoomRoutes;

    private syncCoolDown = new Map();
    private coolDownTime: number = 250;

    constructor() {
        this.app = express();

        this.port = process.env.PORT || AppServer.PORT;
        this.server = createServer(this.app);
        this.io = socketIo(this.server);


        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use('/', express.static(path.join(__dirname, '../../../frontend')));

        this.db = new DB();
        //API
        this.apiroomRoutes = new RoomRoutes();
        this.apiroomRoutes.routes(this.app);
        // Send Frontend Files
        this.app.use('/rooms', express.static(path.join(__dirname, '../../../frontend')));
        this.app.use('/rooms/**', express.static(path.join(__dirname, '../../../frontend')));
        this.app.use('/admin', express.static(path.join(__dirname, '../../../frontend')));
        this.app.use('/admin/**', express.static(path.join(__dirname, '../../../frontend')));
        setInterval(this.clearCdMap, 3600000); // one hour sec(1000) * min(60) * hour(60)
        this.listen();
    }


    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on(SocketEvent.CONNECT, (socket: SocketIO.Socket) => {
            console.log("socket connected");
            socket.on(SocketEvent.DISCONNECT, () => {
                console.log("socket disconnected");
            });
            // TODO Handle roomid for user
            socket.on(SocketEvent.JOIN, (roomId: string) => {
                socket.leaveAll();
                socket.join(roomId);
            });
            socket.on(SocketEvent.PLAY, (roomId: string, time: number) => {
                if (!this.hasCooldown(roomId)) {
                    this.io.to(roomId).emit(SocketEvent.PLAY);
                    this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                    this.syncCoolDown.set(roomId, Date.now());
                }
            });

            socket.on(SocketEvent.PAUSE, (roomId: string, time: number) => {
                if (!this.hasCooldown(roomId)) {
                    this.io.to(roomId).emit(SocketEvent.PAUSE);
                    this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                    this.syncCoolDown.set(roomId, Date.now());
                }
            });
            socket.on(SocketEvent.NEXT, (roomId: string, nextVidId: string) => {
                if (!this.hasCooldown(roomId)) {
                    this.io.to(roomId).emit(SocketEvent.SET_VID, nextVidId);
                    this.io.to(roomId).emit(SocketEvent.ReadRoom, "Next!");
                    this.syncCoolDown.set(roomId, Date.now());
                }
            });
            // Should not be called atm
            socket.on(SocketEvent.SYNCTIME, (roomId: string, time: number) => {
                this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                this.syncCoolDown.set(roomId, Date.now());
            });

            socket.on(SocketEvent.ReadRoom, (roomId: string, cause: string) => {
                if (!this.hasCooldown(roomId)) {
                    this.io.to(roomId).emit(SocketEvent.ReadRoom, cause);
                    console.log(cause + " in " + roomId);
                }
            });

            socket.on(SocketEvent.MSG, (roomId: string, msg: string) => {
                if (!msg.replace(/\s/g, '').length) {
                    socket.emit(SocketEvent.MSG, "Unable to Send (whitespace/empty msg)");
                }
                else {
                    this.io.to(roomId).emit(SocketEvent.MSG, msg);
                }
            });

            socket.on(SocketEvent.LOAD_VID, async (roomId: string, videoID: string) => {
                if (this.ytApi.ready) {
                    this.io.to(roomId).emit(SocketEvent.LOAD_VID, await this.ytApi.getVidInfo(videoID));
                }
            });

            socket.on(SocketEvent.searchYT, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(SocketEvent.searchYT, await this.ytApi.searchKeyWord(searchTerm));
                }
            });

            socket.on(SocketEvent.playlistVideos, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(SocketEvent.playlistVideos, await this.ytApi.getPlaylistVideos(searchTerm));
                }
            });

            socket.on('setYTApi', (pw: string, apiKey: string) => {
                if (DB.instance.checkPw(pw)) {
                    this.ytApi.setApiKey(apiKey);
                }
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    hasCooldown(roomId: string) {
        let syncCD = this.syncCoolDown.get(roomId);
        if (this.syncCoolDown.get(roomId) == null || syncCD + this.coolDownTime < Date.now()) {
            return false;
        }
        return true;
    }

    clearCdMap() {
        if (this.syncCoolDown) {
            for (let key of this.syncCoolDown.keys()) {
                let date = this.syncCoolDown.get(key);
                if (date + this.coolDownTime < Date.now()) {
                    this.syncCoolDown.delete(key);
                }
            }
        }
    }
}

let appserver = new AppServer();
