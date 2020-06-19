import { Server } from 'http';
import * as socketIo from 'socket.io';
import { SocketEvent } from './SocketEvents';
import { SocketRoom } from './SocketRoom';
import { mongooseDB } from '../api/Database';
import { youtubeapi } from '../ytapi';

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
                            this.io.to(key).emit(SocketEvent.GETUSERS, room.getUserCount());
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
                    this.io.to(roomId).emit(SocketEvent.GETUSERS, room.getUserCount());
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
                            this.io.to(key).emit(SocketEvent.GETUSERS, room.getUserCount());
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
                    this.io.to(roomId).emit(SocketEvent.ReadRoom, "Next!");
                    let room = this.currentRooms.get(roomId);
                    room.lastUsed = Date.now();
                }
            });
            // Should not be called atm
            socket.on(SocketEvent.SYNCTIME, (roomId: string, time: number) => {
                let room = this.currentRooms.get(roomId);
                this.io.to(roomId).emit(SocketEvent.SYNCTIME, time);
                if (room) {
                    room.lastUsed = Date.now();
                }
            });

            socket.on(SocketEvent.ReadRoom, (roomId: string, cause: string) => {
                let room = this.currentRooms.get(roomId);
                if (room && (room.getLastUsed() + this.coolDownTime < Date.now())) {
                    this.io.to(roomId).emit(SocketEvent.ReadRoom, cause);
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
        });

    }
}