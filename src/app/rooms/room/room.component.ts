import { Component, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { Room } from 'src/app/model/room';
import { SocketEvent } from 'src/app/Enums';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    @ViewChild(YouTubePlayer) youtubePlayer: YouTubePlayer;

    socket: SocketIOClient.Socket;
    playerHeight: number = 720;

    roomId: any;
    roomData: Room;
    vidInfo: string[]
    results: string[][];
    messages: string[][] = [];
    lastState: YT.PlayerState = YT.PlayerState.UNSTARTED;

    intervalId: any;

    constructor(private apiService: ApiService, private route: ActivatedRoute,
        socketService: SocketService, private _snackBar: MatSnackBar) {

        this.route.params.subscribe((params: Params) => {
            this.roomId = params['id'];
        });


        this.socket = socketService.socket;
        this.socket.emit(SocketEvent.JOIN, this.roomId);

        // VidCtrl
        this.socket.on(SocketEvent.PLAY, () => {
            if (this.lastState != YT.PlayerState.PLAYING) {
                this.youtubePlayer.playVideo();
                console.log("play");
            }

        });
        this.socket.on(SocketEvent.PAUSE, () => {
            if (this.lastState != YT.PlayerState.PAUSED) {
                this.youtubePlayer.pauseVideo();
            }
        });
        this.socket.on(SocketEvent.SET_VID, (videoId: string) => {
            this.youtubePlayer.videoId = videoId;
            if (this.youtubePlayer.getCurrentTime() != 0) {
                this.youtubePlayer.seekTo(0, true);
            }
        });
        this.socket.on(SocketEvent.SYNCTIME, (time: number) => {
            if (Math.abs(this.youtubePlayer.getCurrentTime() - time) > 1) {
                this.youtubePlayer.seekTo(time, true);
            }
        });

        //Room Ctrl
        this.socket.on(SocketEvent.ReadRoom, (cause: string) => {
            this.readRoom(cause);
        });

        this.socket.on(SocketEvent.MSG, (msg: string) => {
            if (this.messages.length % 2 == 0) {
                this.messages.push([msg, "light"]);
            }
            else {
                this.messages.push([msg, "dark"]);
            }
            setTimeout(function () {
                let element = document.getElementById("chat-main");
                if (element) {
                    element.scrollTop = element.scrollHeight;
                }
            }, 100);

        });

        this.socket.on(SocketEvent.searchYT, (result: string[][]) => {
            if (result) {
                console.log(result);
                this.results = result;
            }
        });

        this.socket.on(SocketEvent.LOAD_VID, (result: string[]) => {
            if (result) {
                this.vidInfo = result;
            }
        });

        // Disconnect
        this.socket.on(SocketEvent.DISCONNECT, () => {
            this.openSnackBar("Websocket lost Connection", "X", 5);
        });
    }

    ngOnInit() {
        // yt api already in app component loaded (so its ready (hopefully))
        console.log("Init");
        this.readRoom("Load Room");
        this.onResize();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        console.log("Resize");
        console.log(window.innerWidth);
        this.playerHeight = window.innerHeight * 0.65;
    }

    readRoom(cause: string) {
        this.apiService.getRoom(this.roomId).subscribe((data) => {
            this.roomData = data;
            this.openSnackBar(cause, "X", 1);
            if (!this.vidInfo) {
                this.socket.emit(SocketEvent.LOAD_VID, this.roomId, this.roomData.video);
            }
        });
    }

    onStateChange(event: YT.OnStateChangeEvent) {
        console.log(event.data);
        if (event.data == YT.PlayerState.PLAYING) {
            this.socket.emit(SocketEvent.PLAY, this.roomId, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.PAUSED) {
            this.socket.emit(SocketEvent.PAUSE, this.roomId, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.ENDED) {
            if (this.roomData.queue.length != 0) {
                this.setVideoFromQueue(this.roomData[0], 0);
            }
        }
        this.lastState = event.data;
    }
    // Video



    setVideoFromQueue(videoId: string, i: number) {
        this.roomData.video = videoId;
        this.socket.emit(SocketEvent.LOAD_VID, this.roomId, videoId);
        this.roomData.queue.splice(i, 1);
        this.updateRoom("Set Video From Queue");
    }

    addToQueue(videoId: string) {
        let vidId = this.checkUrlForId(videoId);
        if (!vidId) {
            vidId = videoId;
        }

        if (!this.roomData.video) {
            this.setVideoFromQueue(vidId, 0);
        }
        else {
            this.roomData.queue.push(vidId);
            this.updateRoom("Added Element To Queue");
        }
    }

    removeFromQueue(i: number) {
        this.roomData.queue.splice(i, 1);
        this.updateRoom("Removed Element From Queue");
    }

    updateRoom(cause: string) {
        this.apiService.updateRoom(this.roomId, this.roomData).subscribe(
            (res) => {
                console.log('Room updated!')
                this.socket.emit(SocketEvent.ReadRoom, this.roomId, cause);
            }, (error) => {
                console.log(error);
            });
    }

    searchYT(searchYTVal) {
        this.socket.emit(SocketEvent.searchYT, searchYTVal);
    }

    // 
    checkUrlForId(urlString: string) {
        let vidId;
        try {
            let url = new URL(urlString);
            vidId = url.searchParams.get('v');
            if (!vidId && url.origin == "https://youtu.be") {
                vidId = url.pathname.split('/')[1];
            }
        }
        catch (error) {
            console.log(error);
        }
        return vidId;
    }

    sendMsg(msg: string) {
        this.socket.emit(SocketEvent.MSG, this.roomId, msg);
    }

    openSnackBar(message: string, action: string, time: number) {
        this._snackBar.open(message, action, {
            duration: time * 1000,
        });
    }
}
