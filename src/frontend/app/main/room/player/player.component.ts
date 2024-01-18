import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { SocketEvent } from 'src/frontend/app/Enums';
import { RoomComponent } from '../room.component';

declare const Twitch: any;

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    @ViewChild(YouTubePlayer) youtubePlayer: YouTubePlayer;
    twitchPlayer: any;
    @Input() room: RoomComponent;
    twitchUrl;
    constructor() {

    }

    ngOnInit(): void {
        if (this.room) {
            this.loadYTApiScript();
            this.loadTwitchApiScript();
        }
    }

    loadYTApiScript() {
        let script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.defer = true;
        document.body.append(script);
    }

    loadTwitchApiScript() {
        let script = document.createElement('script');
        script.src = "https://player.twitch.tv/js/embed/v1.js";
        script.async = true;
        script.defer = true;
        document.body.append(script);

        let interval = setInterval(() => {
            if (document.getElementById('twitch-player')?.innerHTML == '' && this.room && this.room.roomData && this.room.roomData.video[0] == 'twitch') {
                this.createTwitchPlayer(this.room.roomData.video[1]);
                clearInterval(interval);
            }
        }, 1000);


    }

    createTwitchPlayer(str: string) {
        let type = str.split('/')[0];
        let id = str.split('/')[1];
        let options;
        if (type == 'channel') {
            options = {
                width: "100%",
                height: "100%",
                channel: id,
            };
        }
        else if (type == 'video') {
            options = {
                width: "100%",
                height: "100%",
                video: id,
            };
        }
        this.twitchPlayer = new Twitch.Player("twitch-player", options);
        this.twitchPlayer.addEventListener(Twitch.Player.PLAY, () => { console.log("Play"); this.room.roomSocket.socket.emit(SocketEvent.PLAY, this.twitchPlayer.getCurrentTime()) });
        this.twitchPlayer.addEventListener(Twitch.Player.PAUSE, () => { console.log("Pause"); this.room.roomSocket.socket.emit(SocketEvent.PAUSE, this.twitchPlayer.getCurrentTime()) });
        this.twitchPlayer.addEventListener(Twitch.Player.ENDED, () => { console.log("Ended"); this.room.setVideoFromQueue(this.room.roomData.queue[0][0], this.room.roomData.queue[0][1], this.room.roomData.queue[0][2], 0) });
    }

    onYTPlayerReady(event) {

    }

    onYTPlayerStateChange(event: YT.OnStateChangeEvent) {
        if (event.data == YT.PlayerState.PLAYING) {
            this.room.roomSocket.socket.emit(SocketEvent.PLAY, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.PAUSED) {
            this.room.roomSocket.socket.emit(SocketEvent.PAUSE, this.youtubePlayer.getCurrentTime());
        }
        else if (event.data == YT.PlayerState.ENDED) {
            if (this.room.roomData.queue.length != 0) {
                this.room.setVideoFromQueue(this.room.roomData.queue[0][0], this.room.roomData.queue[0][1], this.room.roomData.queue[0][2], 0);
            }
        }
        else if (event.data == YT.PlayerState.UNSTARTED) {
            this.youtubePlayer.playVideo();
        }
        this.room.lastState = event.data;
    }

    setVideo(videoid) {
        if (this.room && this.room.roomData.video[0] == 'youtube' && this.youtubePlayer) {
            this.youtubePlayer.videoId = videoid;
        }
        else if (this.room && this.room.roomData.video[0] == 'twitch' && this.twitchPlayer) {
            let type = videoid.split('/')[0];
            let id = videoid.split('/')[1];
            if (type == 'channel') {
                this.twitchPlayer.setChannel(id);
            }
            else if (type == 'video') {
                this.twitchPlayer.setVideo(id);
                console.log("this.setVideo");
            }
        }
    }

    playVideo() {
        if (this.room && this.room.roomData.video[0] == 'youtube') {
            this.youtubePlayer.playVideo();
        }
        else if (this.room && this.room.roomData.video[0] == 'twitch') {
            this.twitchPlayer.play();
        }
    }

    pauseVideo() {
        if (this.room && this.room.roomData.video[0] == 'youtube') {
            this.youtubePlayer.pauseVideo();
        }
        else if (this.room && this.room.roomData.video[0] == 'twitch') {
            this.twitchPlayer.pause();
        }

    }

    seekTo(time, allowSeekAhead) {
        console.log('Seek');
        if (this.room && this.room.roomData.video[0] == 'youtube') {
            this.youtubePlayer.seekTo(time, allowSeekAhead);
        }
        else if (this.room && this.room.roomData.video[0] == 'twitch') {
            this.twitchPlayer.seek(time);
        }
    }

    getCurrentTime() {
        if (this.room && this.room.roomData.video[0] == 'youtube') {
            return this.youtubePlayer.getCurrentTime();
        }
        else if (this.room && this.room.roomData.video[0] == 'twitch') {
            return this.twitchPlayer.getCurrentTime();
        }
    }
    videoHasEnded() {
        return (this.youtubePlayer.getPlayerState() == YT.PlayerState.ENDED)
    }
}
