import * as socketIo from 'socket.io';

import { Server } from 'http';

import { SocketRoom } from './SocketRoom';
import { youtubeapi } from '../ytapi';

/**
 * Socket Events
 */
export enum SocketEvent {
    CONNECT = 'connection',
    DISCONNECT = 'disconnect',
    JOIN = 'join',
    LEAVE = 'leave',
    PLAY = 'play',
    PAUSE = 'pause',
    NEXT = 'next',
    SET_VID = 'setId',
    LOAD_VID = 'loadId',
    SYNCTIME = 'syncTime',
    UPDATEROOM = 'updateRoom',
    MSG = 'msg',
    YTSEARCH = 'searchYoutube',
    YTGETPLAYLIST = 'playlistVids',
    GETUSERS = 'getUsers',
}

export class SocketServer {
    private io: SocketIO.Server;
    private currentRooms: Map<string, SocketRoom> = new Map();
    private coolDownTime: number = 150; // milliseconds

    /**
     * Creates an instance of SocketServer.
     * @param server - HTTP Server
     * @param ytApi - Youtube API
     */
    constructor(server: Server, private ytApi: youtubeapi) {
        this.io = socketIo().listen(server);

        // Socket Events
        this.io.on(SocketEvent.CONNECT, (socket: SocketIO.Socket) => {
            socket.emit(SocketEvent.CONNECT);
            socket.on(SocketEvent.DISCONNECT, () => {
                this.userLeaveAllRooms(socket);
            });

            // Join Room Event
            // User leaves all previous rooms and joins the new one, if it exists, else creates a new one
            // Also updates the userlist and sends it to the room
            socket.on(SocketEvent.JOIN, (roomId: string, username: string) => {
                this.userLeaveAllRooms(socket);
                socket.join(roomId, () => {
                    let room = this.currentRooms.get(roomId);
                    if (!room) {
                        room = new SocketRoom(roomId);
                    }
                    room.userJoin(socket.id, username);
                    this.currentRooms.set(roomId, room);
                    this.io
                        .to(roomId)
                        .emit(SocketEvent.GETUSERS, room.getUsernames());
                    console.log(username + ' joined ' + roomId);
                });
            });

            // Play Event
            // Broadcasts play event to all users in the room and syncs the time
            // Also updates the lastUsed time
            socket.on(SocketEvent.PLAY, (time: number) => {
                let room = this.userGetRoom(socket);
                if (
                    room &&
                    room.getLastUsed() + this.coolDownTime < Date.now()
                ) {
                    this.io.to(room.roomID).emit(SocketEvent.PLAY);
                    this.io.to(room.roomID).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });

            // Pause Event
            // Broadcasts pause event to all users in the room and syncs the time
            // Also updates the lastUsed time
            socket.on(SocketEvent.PAUSE, (time: number) => {
                let room = this.userGetRoom(socket);
                if (
                    room &&
                    room.getLastUsed() + this.coolDownTime < Date.now()
                ) {
                    this.io.to(room.roomID).emit(SocketEvent.PAUSE);
                    this.io.to(room.roomID).emit(SocketEvent.SYNCTIME, time);
                    room.lastUsed = Date.now();
                }
            });

            // Update Room Event
            // Gets the room and broadcasts the update room event to all users in the room
            socket.on(SocketEvent.UPDATEROOM, (cause: string) => {
                let room = this.userGetRoom(socket);
                if (room) {
                    this.io.to(room.roomID).emit(SocketEvent.UPDATEROOM, cause);
                }
            });

            // Msg Event
            // Gets the room and broadcasts the msg event to all users in the room
            // Also checks if the message is empty or too long
            socket.on(SocketEvent.MSG, (msg: string, author: string) => {
                let room = this.userGetRoom(socket);
                if (room) {
                    if (!msg.replace(/\s/g, '').length && msg.length < 300) {
                        socket.emit(
                            SocketEvent.MSG,
                            'Unable to Send (whitespace/empty msg or >300 characters)'
                        );
                    } else {
                        this.io
                            .to(room.roomID)
                            .emit(SocketEvent.MSG, msg, author);
                    }
                }
            });

            // Load Video Event
            // Gets the room and broadcasts the load video event to all users in the room
            // Also checks if the video is already loaded and if the cooldown time is over
            socket.on(SocketEvent.LOAD_VID, async (videoID: string) => {
                let room = this.userGetRoom(socket);
                if (
                    this.ytApi.ready &&
                    room &&
                    room.getLastUsed() + this.coolDownTime < Date.now()
                ) {
                    this.io
                        .to(room.roomID)
                        .emit(
                            SocketEvent.LOAD_VID,
                            await this.ytApi.getVidInfo(videoID)
                        );
                    room.lastUsed = Date.now();
                }
            });

            // Search Youtube Event
            // Emits the search results to the user
            socket.on(SocketEvent.YTSEARCH, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(
                        SocketEvent.YTSEARCH,
                        await this.ytApi.searchKeyWord(searchTerm)
                    );
                }
            });

            // Get Playlist Videos Event
            // Emits the playlist results to the user
            socket.on(SocketEvent.YTGETPLAYLIST, async (searchTerm: string) => {
                if (this.ytApi.ready) {
                    socket.emit(
                        SocketEvent.YTGETPLAYLIST,
                        await this.ytApi.getPlaylistVideos(searchTerm)
                    );
                }
            });
        });
    }

    /**
     * Removes the socket from all rooms
     * @param socket
     */
    userLeaveAllRooms(socket: socketIo.Socket) {
        this.currentRooms.forEach((room: SocketRoom, key: string) => {
            for (let user of room.getUsers()) {
                if (user[0] == socket.id) {
                    room.userLeave(socket.id);
                    this.io
                        .to(room.roomID)
                        .emit(SocketEvent.GETUSERS, room.getUsernames());
                    if (room.getUserCount() <= 0) {
                        this.currentRooms.delete(key);
                    }
                }
            }
        });
        socket.leaveAll();
    }

    /**
     * Gets the room the socket is in
     * @param socket
     * @returns SocketRoom
     */
    userGetRoom(socket: socketIo.Socket) {
        for (let roomid of this.currentRooms.keys()) {
            for (let user of this.currentRooms.get(roomid).users) {
                if (user[0] == socket.id) {
                    return this.currentRooms.get(roomid);
                }
            }
        }
        return null;
    }
}
