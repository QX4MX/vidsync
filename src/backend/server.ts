import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import { SocketEvent } from "./Enum";
import { DB } from './Database';
import {RoomRoutes} from './routes/room.route';



export class AppServer {
    public static readonly PORT: number = 4000;
    private port: any;
    private app: express.Application = express();
    private server: Server;
    private router: any = express.Router();
    private io: SocketIO.Server;
    private db: DB;

    public apiroomRoutes: RoomRoutes = new RoomRoutes();

    syncCoolDown = new Map();

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
        this.apiroomRoutes.routes(this.app);
        this.app.use('/', express.static(path.join(__dirname, '../../../frontend')));
        this.app.use('/room', express.static(path.join(__dirname, '../../../frontend')));
        this.app.use('/room/*', express.static(path.join(__dirname, '../../../frontend')));
        this.db = new DB();
        
        
        setInterval(this.clearCdMap, 3600000 ); // one hour sec(1000) * min(60) * hour(60)
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
            socket.on(SocketEvent.JOIN, (roomId:string) => {
                socket.leaveAll();
                socket.join(roomId);
            });
            socket.on(SocketEvent.PLAY, (roomId:string) => {
                this.io.to(roomId).emit(SocketEvent.PLAY);
            });
            socket.on(SocketEvent.PAUSE, (roomId:string) => {
                this.io.to(roomId).emit(SocketEvent.PAUSE);
            });
            socket.on(SocketEvent.NEXT, (roomId:string, nextVidId:string) => {
                this.io.to(roomId).emit(SocketEvent.SET_VID,nextVidId);
                this.io.to(roomId).emit(SocketEvent.ReadRoom,"Next!");
            });
            socket.on(SocketEvent.SYNCTIME, (roomId:string,time:number) => {
                let syncCD = this.syncCoolDown.get(roomId);
                if(this.syncCoolDown.get(roomId) == null || syncCD + 1000 < Date.now()){
                    this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                    this.syncCoolDown.set(roomId, Date.now());
                }         
            });

            socket.on(SocketEvent.ReadRoom, (roomId:string, cause:string) => {
                this.io.to(roomId).emit(SocketEvent.ReadRoom,cause);
                console.log(cause+ " in "+roomId);
            });
            socket.on(SocketEvent.MSG, (roomId:string,msg:string) => {
                this.io.to(roomId).emit(SocketEvent.MSG,msg);
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    clearCdMap(){
        console.log("Clearing Map");
        for(let key of this.syncCoolDown.keys()){
            let date = this.syncCoolDown.get(key);
            if(date + 1000 < Date.now()){
                this.syncCoolDown.delete(key);
            }
        }
    }
}

let appserver = new AppServer();
