class Player {
    private player: any;
    private lastState: YT.PlayerState;
    private isReady: boolean = false;
    private isPaused: boolean = true;
    private isFs: boolean = false;
    private oldVolume: number = 10;


    constructor(player: any) {
        this.player = player;
    }

    setReady(bool: boolean) {
        this.isReady = bool;
    }

    getIsReady() {
        return this.isReady;
    }

    play() {
        this.player.playVideo();
    }

    pause() {
        this.player.pauseVideo();
    }

    stop() {
        this.player.stopVideo();
    }

    skipTo(sec: number) {
        this.player.seekTo(sec, true);
    }

    setVideo(url: string) {
        let id = this.getVideoId(url);
        /* if (id == null) {
            $('#playerOverlay').css("z-index", "0");
        }
        else {
            $('#playerOverlay').css("z-index", "-2");
        } */
        this.player.loadVideoById(id, 0, "default");
    }

    getVolume() {
        return this.player.getVolume();
    }

    setVolume(vol: number) {
        if (vol == 0) {
            /* $('#mute-video').html('<i class="fa fa-volume-mute"></i>'); */
        }
        else {
           /*  $('#mute-video').html('<i class="fa fa-volume-up"></i>'); */
        }
        this.oldVolume = this.player.getVolume();
        this.player.setVolume(vol);
        /* $('#volume').val(vol); */
    }

    mute() {
        if (this.getVolume() == 0) {
            this.setVolume(this.oldVolume);
        }
        else {
            this.setVolume(0);
        }
    }

    getVideoId(urlString: string) {
        let id = this.getParamFromUrl(urlString, "v");
        if (id == null) {
            return urlString;
        }
        return id;
    }

    getVideoUrl(): string {
        return this.player.getVideoUrl();
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getTitle() {
        let data = this.player.getVideoData();
        return data.title + ' (Quality: ' + data.video_quality + ')';
    }

    getIsFs() {
        return this.isFs;
    }
    getIsPaused() {
        return this.isPaused;
    }

    setIsPaused(bool:boolean){
        this.isPaused = bool;
    }
    
    getDuration() {
        return this.player.getDuration();
    }

    goFullScreen() {
        if (this.isFs) {
            this.exitFullScreen();
            this.isFs = false;
        }
        else {
            let docElm = document.getElementById("main");
            this.fullScreen(docElm);
            this.isFs = true;
        }
    }

    fullScreen(docElm: any) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) { /* Firefox */
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            docElm.webkitRequestFullscreen();
        } else if (docElm.msRequestFullscreen) { /* IE/Edge */
            docElm.msRequestFullscreen();
        }
    }
    
    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    getParamFromUrl(urlString: string, param: string) {
        let paramVal = null;
        try {
            let url = new URL(urlString);
            paramVal = url.searchParams.get(param);
        }
        catch (error) {
        }
        return paramVal;
    }

}

interface Document {
    mozFullScreenElement: any;
    mozCancelFullScreen: any;
    mozRequestFullScreen: any;
    webkitRequestFullscreen: any;
    webkitFullscreenElement: any;
    webkitExitFullscreen: any;
    webkitCancelFullScreen: any;
}

/* let countdown: number;
function vidctrlShow() {
    clearTimeout(this.countdown);
    $('#playerCtrl').css("z-index", "0");
    $('#playerEventOverlay').css("z-index", "0");
    this.countdown = setTimeout('vidctrlHide();', 1000);
}

function vidctrlHide() {
    $('#playerCtrl').css("z-index", "-5");
    $('#playerEventOverlay').css("z-index", "-5");
} */

