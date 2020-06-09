export class youtubeapi {
    private apikey: string;
    public ready: boolean = false;
    private apiUrl: string = 'https://www.googleapis.com/youtube/v3/';
    private fetch = require('node-fetch');
    constructor() {
    }

    setApiKey(key: string) {
        if (!this.ready) {
            this.apikey = key;
            this.ready = true;
            console.log("Set YT Api Key");
            return true;
        }
        return false;
    }


    async searchKeyWord(searchTerm: any) {
        console.log("Api Request - search " + searchTerm);
        if (this.ready) {
            let url = this.apiUrl + 'search?part=snippet&maxResults=10&q=' + searchTerm + '&type=video&key=' + this.apikey;
            let response = await this.fetch(url);
            let json = await response.json();
            let info: string[][] = [];
            for (let item in json.items) {
                let infoStr: string[] = [];
                infoStr.push(json.items[item].id.videoId);
                infoStr.push(json.items[item].snippet.title);
                info.push(infoStr);
            }
            return info;
        }
    }

    /* async getRelatedVids(vidId: string) {
        console.log("Api Request - related Videos " + vidId);
        let url = this.apiUrl + 'search/?part=snippet&type=video&relatedToVideoId=' + vidId + '&maxResults=10&key=' + this.apikey;
        let response = await this.fetch(url);
        let json = await response.json();
        let info: Array<Array<string>> = new Array<Array<string>>();
        for (let item in json.items) {
            let infoStr: Array<string> = new Array<string>();
            infoStr.push(json.items[item].id.videoId);
            infoStr.push(json.items[item].snippet.title);
            info.push(infoStr);
        }
        return info;
    } */

    async getPlaylistVideos(playlistId: string) {
        console.log("Api Request - playlist Videos " + playlistId);
        let url = this.apiUrl + 'playlistItems?part=snippet&playlistId=' + playlistId + '&maxResults=50&key=' + this.apikey;
        let response = await this.fetch(url);
        let json = await response.json();
        let info: Array<Array<string>> = new Array<Array<string>>();
        for (let item in json.items) {
            let infoStr: Array<string> = new Array<string>();
            infoStr.push(json.items[item].snippet.resourceId.videoId);
            infoStr.push(json.items[item].snippet.title);
            info.push(infoStr);
        }
        return info;
    }

    async getVidInfo(videoId: string) {
        console.log("Api Request - vidinfo " + videoId);
        let url = this.apiUrl + 'videos?id=' + videoId + '&part=snippet,contentDetails,statistics&key=' + this.apikey;
        let response = await this.fetch(url);
        let json = await response.json();
        let id = json.items[0].id;
        let title = json.items[0].snippet.title;
        let channel = json.items[0].snippet.channelTitle;
        let postedTime = json.items[0].snippet.publishedAt;
        let views = json.items[0].statistics.viewCount;
        let likes = json.items[0].statistics.likeCount;
        let dislikes = json.items[0].statistics.dislikeCount;
        let returnVal: string[] = [id, title, channel, postedTime, views, likes, dislikes];
        return returnVal;
    }
}