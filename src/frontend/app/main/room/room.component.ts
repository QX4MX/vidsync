import { Component, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Room } from '../../model/room';
import { SocketEvent } from '../../Enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from '../../services/socket.service';
import { RoomComponentSocket } from './room.component.socket';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LanguageService } from '../../services/language.service';
import { PlayerComponent } from './player/player.component';
@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    self = this;
    @ViewChild(PlayerComponent) player: PlayerComponent;

    roomSocket: RoomComponentSocket;
    playerHeight: number = 720;
    chatHeight: number = 720 - 160;

    roomId: any;
    roomData: Room;
    currentUsers: string[] = [];
    vidInfo: string[];
    results: string[][];
    messages: string[][] = [];
    lastState: YT.PlayerState = YT.PlayerState.UNSTARTED;

    selectedIndex: number;
    lastSearch: number = Date.now();
    setVideoParam;
    paramAdded = false;
    roominvite: string;

    changeViewWidthThreshHold = 1024;
    addVideoType = "youtube";
    inTheatreMode = false;
    playerDivWidth = '70%';
    sideTabGroupWidth = '30%';

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private socketService: SocketService,
        public languageService: LanguageService,
    ) {

        this.route.params.subscribe((params: Params) => {
            this.roomId = params['id'];
        });
        this.setVideoParam = this.route.snapshot.queryParams.setVideo;
        this.roominvite = window.location.toString();

    }



    ngOnInit() {
        let apiinterval = setInterval(() => {
            if (this.apiService.user) {
                this.roomSocket = new RoomComponentSocket(this, this.socketService, this.apiService);
                this.readRoom("Load Room");

                // can only add to queue if user exists
                if (this.setVideoParam && !this.paramAdded) {
                    this.addToQueue('youtube', this.setVideoParam);
                    this.paramAdded = true;
                }

                clearInterval(apiinterval);
            }
        }, 250);
        this.onResize();
    }

    @HostListener('document:fullscreenchange', ['$event'])
    onFullScreenChange(event?) {
        if (window.innerWidth > this.changeViewWidthThreshHold) {
            if (document.fullscreenElement) {
                this.playerDivWidth = '85%';
                this.sideTabGroupWidth = '15%';
                this.inTheatreMode = true;
            }
            else {
                this.playerDivWidth = '70%';
                this.sideTabGroupWidth = '30%';
                this.inTheatreMode = false;
            }
            this.onResize();
        }
        else {
            this.playerDivWidth = '100%';
            this.sideTabGroupWidth = '100%';
            if (document.fullscreenElement) {
                this.inTheatreMode = true;
            }
            else {
                this.inTheatreMode = false;
            }

        }

    }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        if (window.innerWidth > this.changeViewWidthThreshHold) {
            if (this.inTheatreMode) {
                this.playerHeight = window.innerHeight;
            }
            else {
                this.playerHeight = Math.round(window.innerHeight * 0.65);
            }
            this.chatHeight = this.playerHeight - 160;
        }
        else {
            let maindiv = document.getElementById('main');
            this.playerDivWidth = '100%';
            this.sideTabGroupWidth = '100%';
            if (this.inTheatreMode) {
                this.playerHeight = Math.round(window.innerHeight * 0.5);
                maindiv.style.setProperty('padding-top', '10vh');
            }
            else {
                this.playerHeight = Math.round(window.innerHeight * 0.2);
                maindiv.style.setProperty('padding-top', '0rem');

            }
            this.chatHeight = this.playerHeight;
        }
    }

    theatreMode() {
        if (!document.fullscreenElement) {
            let maindiv = document.getElementById('main');
            maindiv.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    readRoom(cause: string) {
        this.apiService.getRoom(this.roomId).subscribe((res) => {
            if (res.success) {
                this.roomData = res.data;
                this.openSnackBar(cause, "X", 1);
                if (cause == "Set Video From Queue" && this.roomData.video[0] == 'twitch') {
                    this.player.setVideo(this.roomData.video[1]);
                }
            }
            else {
                setTimeout(() => {
                    this.readRoom("Load Room");
                }, 1000);
            }
        });
    }


    updateRoom(cause: string) {
        this.apiService.updateRoom(this.roomId, this.roomData).subscribe(
            (res) => {
                if (res.success) {
                    this.roomSocket.socket.emit(SocketEvent.UPDATEROOM, cause);
                }
            }, (error) => {
                //console.log(error);
            });
    }

    setVideoFromQueue(videoType: string, videoId: string, i: number) {
        //this.socket.emit(SocketEvent.LOAD_VID,videoId);
        this.roomData.queue.splice(i, 1);
        this.roomData.video = [videoType, videoId];
        if (videoType == 'youtube') {
            // load YT Vidinfo
            this.roomSocket.socket.emit(SocketEvent.LOAD_VID, videoId);
        }
        this.updateRoom("Set Video From Queue");
    }

    addToQueue(videoType: string, videoId: string) {
        if (!this.roomData.video) {
            this.setVideoFromQueue(videoType, videoId, 0);
        }
        else {
            this.roomData.queue.push([videoType, videoId]);
            this.updateRoom("Added Element To Queue");
        }
    }

    removeFromQueue(i: number) {
        this.roomData.queue.splice(i, 1);
        this.updateRoom("Removed Element From Queue");
    }

    searchYT(searchVal: string) {
        // 1 sec cooldown
        let vidId = this.checkUrlForParam(searchVal, 'v');
        let playlistId = this.checkUrlForParam(searchVal, 'list');
        if (!vidId && searchVal.includes("https://youtu.be")) {
            vidId = this.checkShortYTLink(searchVal);
        }
        if (playlistId && playlistId != 'LL') {
            this.roomSocket.socket.emit(SocketEvent.YTGETPLAYLIST, playlistId);
        }
        else if (vidId) {
            this.addToQueue('youtube', vidId);
        }

        else if (this.lastSearch < Date.now() - 1000) {
            this.lastSearch = Date.now();
            this.roomSocket.socket.emit(SocketEvent.YTSEARCH, searchVal);
        }
    }

    searchTwitch(link: string) {
        try {
            let url = new URL(link);
            let id;
            if (url.pathname.split('/')[1] == 'videos') {

                id = url.pathname.split('/')[2];
                console.log(id);
                this.addToQueue('twitch', 'video/' + id);
            }
            else {
                id = url.pathname.split('/')[1];
                console.log(id);
                this.addToQueue('twitch', 'channel/' + id);
            }
        }
        catch (error) {
        }

    }

    addPlaylistToQueue() {
        if (this.results) {
            for (let elem of this.results) {
                this.roomData.queue.push(['youtube', elem[0]]);
            }
            this.updateRoom('Added All to Queue');
        }
    }

    sendMsg(msg: string) {
        if (msg.replace(/\s/g, '').length != 0) {
            if (this.apiService.user) {
                this.roomSocket.socket.emit(SocketEvent.MSG, msg, this.apiService.user.username);
            }
            else {
                this.roomSocket.socket.emit(SocketEvent.MSG, msg, '');
            }
        }
        else {
            this.messages.push(['Cant send empty Message', 'System']);
        }

    }


    checkUrlForParam(urlString: string, param: string) {
        let paramResult;
        try {
            let url = new URL(urlString);
            paramResult = url.searchParams.get(param);
        }
        catch (error) {
            //console.log(error);
        }
        return paramResult;
    }

    checkShortYTLink(urlString: string) {
        let paramResult;
        try {
            let url = new URL(urlString);
            if (url.origin == "https://youtu.be") {
                paramResult = url.pathname.split('/')[1];
            }
        }
        catch (error) {
            //console.log(error);
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

    openModal() {
        document.getElementById('addModal').style.display = "block";
    }

    closeModal() {
        document.getElementById('addModal').style.display = "none";
        document.getElementById('playerdiv').scrollIntoView();
    }

    setVideoType(type: string) {
        this.addVideoType = type;
    }
}
