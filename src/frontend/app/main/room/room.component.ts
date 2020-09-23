import { Component, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { Room } from '../../model/room';
import { SocketEvent } from '../../Enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { SocketService } from '../../services/socket.service';
import { RoomComponentSocket } from './room.component.socket';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    @ViewChild(YouTubePlayer) youtubePlayer: YouTubePlayer;

    roomSocket: RoomComponentSocket;
    username;
    playerHeight: number = 720;

    roomId: any;
    roomData: Room;
    onlineCount: number = 0;
    vidInfo: string[]
    results: string[][];
    messages: string[][] = [];
    lastState: YT.PlayerState = YT.PlayerState.UNSTARTED;

    selectedIndex: number;
    lastSearch: number = Date.now();
    setVideoParam;
    paramAdded = false;
    roominvite: string;

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private titleService: Title,
        private socketService: SocketService,

    ) {
        this.route.params.subscribe((params: Params) => {
            this.roomId = params['id'];
        });
        this.roomSocket = new RoomComponentSocket(this.roomId, this, socketService.socket);
        this.setVideoParam = this.route.snapshot.queryParams.setVideo;
        console.log(this.setVideoParam);
        this.roominvite = window.location.toString();
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
        this.apiService.getRoom(this.roomId).subscribe((res) => {
            if (res.success) {
                this.roomData = res.data;
                this.openSnackBar(cause, "X", 1);
                //this.titleService.setTitle('vidsync - ' + this.roomData.name + ' (Room)');
                if (this.setVideoParam && !this.paramAdded) {
                    this.addToQueue(this.setVideoParam);
                    this.paramAdded = true;
                }
            }
        });
    }


    updateRoom(cause: string) {
        this.apiService.updateRoom(this.roomId, this.roomData).subscribe(
            (res) => {
                this.roomSocket.socket.emit(SocketEvent.UPDATEROOM, this.roomId, cause);
            }, (error) => {
                console.log(error);
            });
    }

    onStateChange(event: YT.OnStateChangeEvent) {
        if (event.data == YT.PlayerState.PLAYING) {
            this.roomSocket.socket.emit(SocketEvent.PLAY, this.roomId, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.PAUSED) {
            this.roomSocket.socket.emit(SocketEvent.PAUSE, this.roomId, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.ENDED) {
            if (this.roomData.queue.length != 0) {
                this.setVideoFromQueue(this.roomData.queue[0], 0);
            }
        }
        else if (event.data == YT.PlayerState.UNSTARTED) {
            this.youtubePlayer.playVideo();
        }
        this.lastState = event.data;
    }
    // Video



    setVideoFromQueue(videoId: string, i: number) {
        this.roomData.video = videoId;
        //this.socket.emit(SocketEvent.LOAD_VID, this.roomId, videoId);
        this.roomData.queue.splice(i, 1);
        this.roomData.video = videoId;
        this.updateRoom("Set Video From Queue");
    }

    addToQueue(videoId: string) {
        let vidId = this.checkUrlForParam(videoId, 'v');
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



    searchYT(searchYTVal) {
        // 1 sec cooldown
        if (this.lastSearch < Date.now() - 1000) {
            this.lastSearch = Date.now();
            this.roomSocket.socket.emit(SocketEvent.YTSEARCH, searchYTVal);
        }

    }

    addPlaylistToQueue() {
        if (this.results) {
            for (let elem of this.results) {
                this.roomData.queue.push(elem[0]);
            }
            this.updateRoom('Added All to Queue');
        }
    }

    searchYTPlaylist(searchYTVal) {
        let playlistId = this.checkUrlForParam(searchYTVal, 'list');
        this.roomSocket.socket.emit(SocketEvent.YTGETPLAYLIST, playlistId);
    }

    sendMsg(msg: string) {
        if (this.apiService.user) {
            this.roomSocket.socket.emit(SocketEvent.MSG, this.roomId, msg, this.apiService.user.username);
        }
        else {
            this.roomSocket.socket.emit(SocketEvent.MSG, this.roomId, msg, '');
        }
    }


    checkUrlForParam(urlString: string, param: string) {
        let paramResult;
        try {
            let url = new URL(urlString);
            paramResult = url.searchParams.get(param);
            if (!paramResult && url.origin == "https://youtu.be") {
                paramResult = url.pathname.split('/')[1];
            }
        }
        catch (error) {
            console.log(error);
        }
        return paramResult;
    }


    openSnackBar(message: string, action: string, time: number) {
        this._snackBar.open(message, action, {
            duration: time * 1000,
        });
    }

    selectTab(index: number): void {
        this.selectedIndex = index;
    }

    onTabChange(event: MatTabChangeEvent) {
        this.selectedIndex = event.index;
    }
}
