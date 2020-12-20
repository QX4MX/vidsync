import { SocketEvent } from '../../Enums';
import { SocketService } from '../../services/socket.service';
import { RoomComponent } from './room.component';

export class RoomComponentSocket {
    socket: SocketIOClient.Socket;

    constructor(private room: RoomComponent, socketService: SocketService) {
        this.socket = socketService.socket;
        this.socket.emit(SocketEvent.JOIN, this.room.roomId);

        // VidCtrl
        this.socket.on(SocketEvent.PLAY, () => {
            if (room.lastState != YT.PlayerState.PLAYING) {
                room.youtubePlayer.playVideo();
            }

        });
        this.socket.on(SocketEvent.PAUSE, () => {
            if (room.lastState != YT.PlayerState.PAUSED) {
                room.youtubePlayer.pauseVideo();
            }
        });
        this.socket.on(SocketEvent.SET_VID, (videoId: string) => {
            room.youtubePlayer.videoId = videoId;
            if (room.youtubePlayer.getCurrentTime() != 0) {
                room.youtubePlayer.seekTo(0, true);
            }
        });
        this.socket.on(SocketEvent.SYNCTIME, (time: number) => {
            if (Math.abs(room.youtubePlayer.getCurrentTime() - time) > 1) {
                room.youtubePlayer.seekTo(time, true);
            }
        });

        //Room Ctrl
        this.socket.on(SocketEvent.GETUSERCOUNT, (userAmmount: number) => {
            room.onlineCount = userAmmount;
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
                room.selectTab(3);
                document.getElementById('queue').scrollIntoView();
            }
        });

        this.socket.on(SocketEvent.LOAD_VID, (result: string[]) => {
            if (result) {
                room.vidInfo = result;
            }
        });

        this.socket.on(SocketEvent.YTGETPLAYLIST, (result: string[][]) => {
            if (result) {
                room.results = result;
                room.selectTab(3);
            }
        });

        this.socket.on(SocketEvent.CONNECT, () => {
            room.openSnackBar("Socket Connected", "X", 1);
            this.socket.emit(SocketEvent.JOIN, this.room.roomId);
        });

        this.socket.on(SocketEvent.DISCONNECT, () => {
            room.openSnackBar("Socket Disconnected", "X", 1);
        });

    }
}