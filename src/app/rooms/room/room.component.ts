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
	

	
	addToQValue = '';
	msgValue = '';
	messages: string[][] = [["Hello","dark"],["Hello","light"],["Hello","dark"]];
	lastState:YT.PlayerState = YT.PlayerState.UNSTARTED;

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenHeight = window.innerHeight;
		this.screenWidth = window.innerWidth;
		this.playerWidth = this.screenWidth * 0.6;
		this.playerHeight = this.playerWidth * 0.5625;
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
		this.readRoom();
		this.socket = socketService.socket;
		this.socket.emit(SocketEvent.JOIN, this.roomId);
		this.socket.on(SocketEvent.PLAY, () => { this.youtubePlayer.playVideo();});
    	this.socket.on(SocketEvent.PAUSE, () => { this.youtubePlayer.pauseVideo();});
		this.socket.on(SocketEvent.NEXT, () => { this.setVideoFromQueue(this.roomData.queue[0],0) });
		this.socket.on(SocketEvent.SYNCTIME, (time:number) => {
			if(Math.abs(this.youtubePlayer.getCurrentTime() - time) > 1){
				this.youtubePlayer.seekTo(time,true);
			}
		});
		this.socket.on(SocketEvent.ReadRoom, () => {this.readRoom()});
		this.socket.on(SocketEvent.MSG, (msg:string) => {
			if(this.messages.length % 2 == 0){
				this.messages.push([msg,"dark"]);
			}
			else{
				this.messages.push([msg,"light"]);
			}
			let element = document.getElementById("msgList");
    		element.scrollTop = element.scrollHeight;
		})
		this.onResize();
	}
	  
	ngOnInit() {
		// yt api already in app component loaded (so its ready (hopefully))
				
	}

	readRoom(){
		this.apiService.getRoom(this.roomId).subscribe((data) => {
		this.roomData = data;
		this.videoId = this.roomData.video;
		this.openSnackBar("Video or Queue changed!","X");
		});
	}	
	
	onStateChange(event: YT.OnStateChangeEvent) {
		
		console.log(event.data);

		if(event.data == YT.PlayerState.PLAYING){
			// Everyone sync if video starts playing (will only sync if someone is more than 2 sec away)
			if(this.lastState != YT.PlayerState.PLAYING){
				this.socket.emit(SocketEvent.SYNCTIME,this.roomId, this.youtubePlayer.getCurrentTime());
			}
			this.socket.emit(SocketEvent.PLAY,this.roomId);
		}
		else if(event.data == YT.PlayerState.PAUSED){
			this.socket.emit(SocketEvent.PAUSE,this.roomId);
		}
		else if(event.data == YT.PlayerState.BUFFERING){
			
			if(this.lastState == YT.PlayerState.UNSTARTED){
				
			}
			// Pause -> Someone buffered mid video
			else if(this.lastState == YT.PlayerState.PLAYING){
				this.socket.emit(SocketEvent.PAUSE, this.roomId);
			}
			else if(this.lastState == YT.PlayerState.PAUSED){
				
			}

			
		}
		else if(event.data == YT.PlayerState.UNSTARTED){

		}
		else if(event.data == YT.PlayerState.ENDED){
		}
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
		this.updateRoom();
	}

	addToQueue(){
		//TODO get param if link
		let vidId = this.getParamFromUrl(this.addToQValue, 'v');
		if(!vidId){
			vidId = this.addToQValue;
		}
		this.roomData.queue.push(vidId);
		this.updateRoom();
	}

	removeFromQueue(i:number){
		this.roomData.queue.splice(i, 1);
		this.updateRoom();
	}

	updateRoom(){
		this.apiService.updateRoom(this.roomId,this.roomData).subscribe(
			(res) => {
			  console.log('Room updated!')
			  this.ngZone.run(() => this.router.navigateByUrl('/room/'+this.roomId))
			  this.socket.emit(SocketEvent.ReadRoom);
			}, (error) => {
			  console.log(error);
		});
		this.socket.emit(SocketEvent.ReadRoom, this.roomId);
		
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

	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
		  duration: 1000,
		});
	}
}
