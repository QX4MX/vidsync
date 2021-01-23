import { Server } from 'http';
import * as socketIo from 'socket.io';
import { SocketEvent } from './SocketEvents';
import { SocketRoom } from './SocketRoom';
import { mongooseDB } from '../api/Database';
import { youtubeapi } from '../ytapi';
import { IRoom } from '../api/models/room';

export class SocketServer {
    private io: SocketIO.Server;
    private currentRooms: Map<string, SocketRoom> = new Map();
    private coolDownTime: number = 150; // milliseconds

    constructor(server: Server, private ytApi: youtubeapi) {
        this.io = socketIo().listen(server);
        this.io.on(SocketEvent.CONNECT, (socket: SocketIO.Socket) => {
            socket.emit(SocketEvent.CONNECT);
            socket.on(SocketEvent.DISCONNECT, () => {
                this.userLeaveAllRooms(socket);
            });

            socket.on(SocketEvent.JOIN, (roomId: string) => {
                this.userLeaveAllRooms(socket);
                socket.join(roomId, () => {
                    let room = this.currentRooms.get(roomId);
                    if (!room) {
                        room = new SocketRoom(roomId);
                        room.userJoin(socket.id);
                        this.currentRooms.set(roomId, room);
                    }
                    else {
                        room.userJoin(socket.id);
                        this.currentRooms.set(roomId, room);
                    }
                    this.io.to(roomId).emit(SocketEvent.GETUSERCOUNT, room.getUserCount());


                });
            });

            socket.on(SocketEvent.PLAY, (time: number) => {
                let room = this.userGetRoom(socket);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(room.roomID).emit(SocketEvent.PLAY);
                    this.io.to(room.roomID).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });

            socket.on(SocketEvent.PAUSE, (time: number) => {
                let room = this.userGetRoom(socket);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(room.roomID).emit(SocketEvent.PAUSE);
                    this.io.to(room.roomID).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });
            socket.on(SocketEvent.NEXT, (nextVidId: string) => {
                let room = this.userGetRoom(socket);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(room.roomID).emit(SocketEvent.SET_VID, nextVidId);
                    this.io.to(room.roomID).emit(SocketEvent.UPDATEROOM, "Next!");
                    room.lastUsed = Date.now();
                }
            });

            socket.on(SocketEvent.UPDATEROOM, (cause: string) => {
                let room = this.userGetRoom(socket);
                if (room) {
                    this.io.to(room.roomID).emit(SocketEvent.UPDATEROOM, cause);
                }
            });

            socket.on(SocketEvent.MSG, (msg: string, author: string) => {
                let room = this.userGetRoom(socket);
                if (!msg.replace(/\s/g, '').length && room) {
                    socket.emit(SocketEvent.MSG, "Unable to Send (whitespace/empty msg)");
                }
                else {
                    this.io.to(room.roomID).emit(SocketEvent.MSG, msg, author);
                }
            });

            socket.on(SocketEvent.LOAD_VID, async (videoID: string) => {
                let room = this.userGetRoom(socket);
                if (this.ytApi.ready && room) {
                    this.io.to(room.roomID).emit(SocketEvent.LOAD_VID, await this.ytApi.getVidInfo(videoID));
                }
            });

            socket.on(SocketEvent.YTSEARCH, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(SocketEvent.YTSEARCH, await this.ytApi.searchKeyWord(searchTerm));
                }
            });

            socket.on(SocketEvent.YTGETPLAYLIST, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(SocketEvent.YTGETPLAYLIST, await this.ytApi.getPlaylistVideos(searchTerm));
                }
            });
        });

    }

    userLeaveAllRooms(socket: socketIo.Socket) {
        this.currentRooms.forEach((room: SocketRoom, key: string) => {
            for (let user of room.getUsers()) {
                if (user == socket.id) {
                    room.userLeave(socket.id);
                    this.io.to(room.roomID).emit(SocketEvent.GETUSERCOUNT, room.getUserCount());
                    if (room.getUserCount() <= 0) {
                        this.currentRooms.delete(key);
                    }
                }
            }
        });
        socket.leaveAll();
    }

    userGetRoom(socket: socketIo.Socket) {
        for (let roomid of this.currentRooms.keys()) {
            if (this.currentRooms.get(roomid).users.includes(socket.id)) {
                return this.currentRooms.get(roomid);
            }
        }
        return null;
    }
}