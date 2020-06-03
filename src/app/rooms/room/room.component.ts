import { Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone, HostListener } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {SocketService} from 'src/app/services/socket.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { YouTubePlayer} from '@angular/youtube-player';
import { Room } from 'src/app/model/room';
import { SocketEvent } from 'src/app/Enums';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
	public socket : SocketIOClient.Socket;
	screenHeight:number;
	screenWidth:number;
	playerHeight: number;
	playerWidth : number;

	roomId : any;
	roomData : Room;
	videoId: string;
	messages: string[][] = [];
	
	addToQValue = '';
	msgValue = '';
	

	lastState:YT.PlayerState = YT.PlayerState.UNSTARTED;

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenHeight = window.innerHeight;
		this.screenWidth = window.innerWidth;
		if(this.screenWidth >= 1024){
			this.playerWidth = this.screenWidth * 0.6;
			this.playerHeight = this.playerWidth * 0.5625;
		}
		else{
			this.playerWidth = this.screenWidth * 0.9;
			this.playerHeight = this.playerWidth * 0.5625;
		}
		
	}

	@Output() public click: EventEmitter<MouseEvent> = new EventEmitter();
	onButtonClick(event: MouseEvent) {
		event.stopPropagation();
		this.click.emit(event);
	}

	
	@ViewChild(YouTubePlayer) youtubePlayer: YouTubePlayer;
	
	

	constructor(private apiService: ApiService,private route: ActivatedRoute,private router: Router,private ngZone: NgZone, socketService:SocketService,private _snackBar: MatSnackBar) {
		this.route.params.subscribe((params: Params) => {
			this.roomId = params['id'];
		});

		this.readRoom("Load Room");
		this.socket = socketService.socket;
		this.socket.emit(SocketEvent.JOIN, this.roomId);
		
		// VidCtrl
		this.socket.on(SocketEvent.PLAY, () => {
			if(this.lastState != YT.PlayerState.PLAYING){
				this.youtubePlayer.playVideo();
				console.log("play");
			}
			
		});
    	this.socket.on(SocketEvent.PAUSE, () => { 
			if(this.lastState != YT.PlayerState.PAUSED){
				this.youtubePlayer.pauseVideo();
			}
		});
		this.socket.on(SocketEvent.SET_VID, (videoId:string) => {
			this.youtubePlayer.videoId = videoId;
			if(this.youtubePlayer.getCurrentTime() != 0){
				this.youtubePlayer.seekTo(0,true);
			}
		});
		this.socket.on(SocketEvent.SYNCTIME, (time:number) => {
			if(Math.abs(this.youtubePlayer.getCurrentTime() - time) > 1){
				this.youtubePlayer.seekTo(time,true);
			}
		});

		//Room Ctrl
		this.socket.on(SocketEvent.ReadRoom, (cause:string) => {
			this.readRoom(cause);
		});
		this.socket.on(SocketEvent.MSG, (msg:string) => {
			if(this.messages.length % 2 == 0){
				this.messages.push([msg,"dark"]);
			}
			else{
				this.messages.push([msg,"light"]);
			}
			//TODO doesnt scroll all the way down (1 msg is hidden)
			let element = document.getElementById("msgList");
    		element.scrollTop = element.scrollHeight;
		})

		// Disconnect
		this.socket.on(SocketEvent.DISCONNECT, () => {
			this.openSnackBar("Websocket lost Connection","X",5);
		});

		this.onResize();
	}
	  
	ngOnInit() {
		// yt api already in app component loaded (so its ready (hopefully))
				
	}

	readRoom(cause:string){
		this.apiService.getRoom(this.roomId).subscribe((data) => {
			this.roomData = data;
			this.videoId = this.roomData.video;
			this.openSnackBar(cause,"X",1);
		});
	}	
	
	onStateChange(event: YT.OnStateChangeEvent) {	
		console.log(event.data);
		if(event.data == YT.PlayerState.PLAYING){
			this.socket.emit(SocketEvent.PLAY,this.roomId,this.youtubePlayer.getCurrentTime());
		}
		else if(event.data == YT.PlayerState.PAUSED){
			this.socket.emit(SocketEvent.PAUSE,this.roomId,this.youtubePlayer.getCurrentTime());
		}
		else if(event.data == YT.PlayerState.ENDED){
			this.setVideoFromQueue(this.roomData[0],0);
		}
		this.lastState = event.data;
	}
	// Video

	addToQueueonKey(value: string) {
		this.addToQValue = value;
	}
	msgonKey(value: string) {
		this.msgValue = value;
	}

	setVideoFromQueue(videoId:string, i:number){
		this.roomData.video = videoId;
		this.roomData.queue.splice(i, 1);
		this.updateRoom("Set Video From Queue");
	}

	addToQueue(){
		//TODO get param if link
		let vidId = this.getParamFromUrl(this.addToQValue, 'v');
		if(!vidId){
			vidId = this.addToQValue;
		}
		this.roomData.queue.push(vidId);
		this.updateRoom("Added Element To Queue");
	}

	removeFromQueue(i:number){
		this.roomData.queue.splice(i, 1);
		this.updateRoom("Removed Element From Queue");
	}

	updateRoom(cause:string){
		this.apiService.updateRoom(this.roomId,this.roomData).subscribe(
			(res) => {
			  console.log('Room updated!')
			  this.ngZone.run(() => this.router.navigateByUrl('/room/'+this.roomId))
			  this.socket.emit(SocketEvent.ReadRoom, this.roomId, cause);
			}, (error) => {
			  console.log(error);
		});		
	}

	getParamFromUrl(urlString: string, param: string) {
		let paramVal = null;
		try {
			let url = new URL(urlString);
			paramVal = url.searchParams.get(param);
		}
		catch (error) {
			console.log(error);
		}
		return paramVal;
	}

	sendMsg(){
		this.socket.emit(SocketEvent.MSG, this.roomId,this.msgValue);
		this.msgValue = '';
	}

	openSnackBar(message: string, action: string, time:number) {
		this._snackBar.open(message, action, {
		  duration: time*1000,
		});
	}
}
