import { SocketEvent } from '../../Enums';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';
import { RoomComponent } from './room.component';

export class RoomComponentSocket {
    socket: SocketIOClient.Socket;

    constructor(private room: RoomComponent, socketService: SocketService, apiService: ApiService) {
        this.socket = socketService.socket;
        // VidCtrl

        this.socket.on(SocketEvent.PLAY, () => {
            room.player.playVideo();
        });

        this.socket.on(SocketEvent.PAUSE, () => {
            room.player.pauseVideo();
        });

        this.socket.on(SocketEvent.SYNCTIME, (time: number) => {
            if (Math.abs(room.player.getCurrentTime() - time) > 1) {
                room.player.seekTo(time, true);
            }
        });

        //Room Ctrl
        this.socket.on(SocketEvent.GETUSERS, (users: string[]) => {
            room.currentUsers = users;
            console.log(users);
        });
        this.socket.on(SocketEvent.UPDATEROOM, (cause: string) => {
            room.readRoom(cause);
        });

        this.socket.on(SocketEvent.MSG, (msg: string, author: string) => {
            if (author == null || author == '') {
                author = 'Anonym';
            }
            if (room.messages.length % 2 == 0) {
                room.messages.push([msg, author, "bg-secondary-light",]);
            }
            else {
                room.messages.push([msg, author, "bg-secondary-dark"]);
            }
            setTimeout(function () {
                let element = document.getElementById("chat-main");
                if (element) {
                    element.scrollTop = element.scrollHeight;
                }
            }, 100);

        });

        this.socket.on(SocketEvent.YTSEARCH, (result: string[][]) => {
            if (result) {
                room.results = result;
                room.selectTab(2);
                document.getElementById('queue').scrollIntoView();
            }
        });

        this.socket.on(SocketEvent.LOAD_VID, (result: string[]) => {
            if (result) {
                for (let i = 4; i < 7; i++) {
                    for (let j = -3; j > - result[i].length; j = j - 4) {
                        result[i] = result[i].substr(0, result[i].length + j) + "," + result[i].substr(result[i].length + j);
                    }
                }
                result[3] = new Date(result[3]).toDateString().split(' ').slice(1).join(' '); // remove weekday from DateString
                room.vidInfo = result;

            }
        });

        this.socket.on(SocketEvent.YTGETPLAYLIST, (result: string[][]) => {
            if (result) {
                room.results = result;
                room.selectTab(2);
            }
        });

        this.socket.on(SocketEvent.CONNECT, () => {
            room.openSnackBar("Socket Connected", "X", 1);
            this.socket.emit(SocketEvent.JOIN, this.room.roomId, apiService.user.username);
        });

        this.socket.on(SocketEvent.DISCONNECT, () => {
            room.openSnackBar("Socket Disconnected", "X", 1);
        });

        this.socket.emit(SocketEvent.JOIN, this.room.roomId, apiService.user.username);


    }
}