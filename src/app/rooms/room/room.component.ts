import { Component, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';
import { Room } from 'src/app/model/room';
import { SocketEvent } from 'src/app/Enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { RoomComponentSocket } from './room.component.socket';
import { AuthService } from 'src/app/services/auth.service';

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

    constructor(private apiService: ApiService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private titleService: Title,
        private socketService: SocketService,

    ) {
        this.route.params.subscribe((params: Params) => {
            this.roomId = params['id'];
        });
        this.roomSocket = new RoomComponentSocket(this.roomId, this, socketService.socket);
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
            console.log('Room loaded! ', data)
            this.roomData = data;
            this.openSnackBar(cause, "X", 1);
            this.titleService.setTitle('vidsync - ' + this.roomData.name + ' (Room)');
            /* this.meta.updateTag({ name: 'og:image', content: 'https://img.youtube.com/vi/' + this.roomData.video + '/hqdefault.jpg' });
            this.meta.updateTag({ name: 'twitter:image', content: 'https://img.youtube.com/vi/' + this.roomData.video + '/hqdefault.jpg' }); */
        });
    }

    updateRoom(cause: string) {
        this.apiService.updateRoom(this.roomId, this.roomData).subscribe((res) => {
            this.roomSocket.socket.emit(SocketEvent.UPDATEROOM, this.roomId, cause);
        }, (error) => {
            console.log(error);
        });
    }

    onStateChange(event: YT.OnStateChangeEvent) {
        console.log(event.data);
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
        this.roomSocket.socket.emit(SocketEvent.YTSEARCH, searchYTVal);
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
        console.log(playlistId);
        this.roomSocket.socket.emit(SocketEvent.YTGETPLAYLIST, playlistId);
    }

    sendMsg(msg: string) {
        if (this.authService.user) {
            this.roomSocket.socket.emit(SocketEvent.MSG, this.roomId, msg, this.authService.user.getBasicProfile().getName());
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
}
