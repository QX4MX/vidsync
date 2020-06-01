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
        this.apiroomRoutes.routes(this.app);
        this.listen();
    }


    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on(SocketEvent.CONNECT, (socket: SocketIO.Socket) => {
            console.log("socket connected");
            socket.on(SocketEvent.JOIN, (roomId:string) => {
                socket.join(roomId);
            });
            socket.on(SocketEvent.PLAY, (roomId:string) => {this.io.to(roomId).emit(SocketEvent.PLAY)});
            socket.on(SocketEvent.PAUSE, (roomId:string) => {this.io.to(roomId).emit(SocketEvent.PAUSE)});
            socket.on(SocketEvent.NEXT, (roomId:string) => {this.io.to(roomId).emit(SocketEvent.NEXT)});
            socket.on(SocketEvent.SYNCTIME, (roomId:string,time:number) => {this.io.to(roomId).emit(SocketEvent.SYNCTIME, time)});

            socket.on(SocketEvent.ReadRoom, (roomId:string) => {this.io.to(roomId).emit(SocketEvent.ReadRoom)});
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}

let appserver = new AppServer();
