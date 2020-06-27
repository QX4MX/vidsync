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
    private coolDownTime: number = 150;

    constructor(server: Server, private ytApi: youtubeapi) {
        this.io = socketIo(server);
        this.io.on(SocketEvent.CONNECT, (socket: SocketIO.Socket) => {
            console.log("Sockets => " + socket.id + " connected");
            socket.on(SocketEvent.DISCONNECT, () => {
                this.currentRooms.forEach((room: SocketRoom, key: string) => {
                    for (let user of room.getUsers()) {
                        if (user == socket.id) {
                            room.userLeave(socket.id);
                            if (room.getUserCount() <= 0) {
                                this.currentRooms.delete(key);
                            }
                            this.io.to(key).emit(SocketEvent.GETUSERCOUNT, room.getUserCount());
                        }
                    }
                });
                console.log("Sockets => " + socket.id + " disconnected");

            });
            // TODO Handle roomid for user
            socket.on(SocketEvent.JOIN, (roomId: string) => {
                socket.join(roomId, () => {
                    console.log("Sockets => " + socket.id + " join room: " + roomId);
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

            socket.on(SocketEvent.LEAVE, () => {
                this.currentRooms.forEach((room: SocketRoom, key: string) => {
                    for (let user of room.getUsers()) {
                        if (user == socket.id) {
                            console.log("Sockets => " + socket.id + " leave room: " + key);
                            room.userLeave(socket.id);
                            if (room.getUserCount() <= 0) {
                                this.currentRooms.delete(key);;
                            }
                            this.io.to(key).emit(SocketEvent.GETUSERCOUNT, room.getUserCount());
                        }
                    }
                });
            });


            socket.on(SocketEvent.PLAY, (roomId: string, time: number) => {
                let room = this.currentRooms.get(roomId);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(roomId).emit(SocketEvent.PLAY);
                    this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });

            socket.on(SocketEvent.PAUSE, (roomId: string, time: number) => {
                let room = this.currentRooms.get(roomId);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(roomId).emit(SocketEvent.PAUSE);
                    this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });
            socket.on(SocketEvent.NEXT, (roomId: string, nextVidId: string) => {
                let room = this.currentRooms.get(roomId);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(roomId).emit(SocketEvent.SET_VID, nextVidId);
                    this.io.to(roomId).emit(SocketEvent.UPDATEROOM, "Next!");
                    let room = this.currentRooms.get(roomId);
                    room.lastUsed = Date.now();
                }
            });

            socket.on(SocketEvent.UPDATEROOM, (roomId: string, cause: string) => {
                let room = this.currentRooms.get(roomId);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(roomId).emit(SocketEvent.UPDATEROOM, cause);
                    console.log(cause + " in " + roomId);
                }
            });

            socket.on(SocketEvent.MSG, (roomId: string, msg: string, author: string) => {
                if (!msg.replace(/\s/g, '').length) {
                    socket.emit(SocketEvent.MSG, "Unable to Send (whitespace/empty msg)");
                }
                else {
                    this.io.to(roomId).emit(SocketEvent.MSG, msg, author);
                }
            });

            socket.on(SocketEvent.LOAD_VID, async (roomId: string, videoID: string) => {
                if (this.ytApi.ready) {
                    this.io.to(roomId).emit(SocketEvent.LOAD_VID, await this.ytApi.getVidInfo(videoID));
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

            socket.on(SocketEvent.GETACTIVEROOMS, (rooms: Array<any>) => {
                for (let room of rooms) {
                    let current = this.currentRooms.get(room._id);
                    if (current) {
                        room.userCount = current.getUserCount();
                    }
                }
                socket.emit(SocketEvent.GETACTIVEROOMS, rooms);
            });
        });

    }
}