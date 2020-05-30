import { Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ApiService } from 'src/app/api-services/api.service';
import {SocketService} from 'src/app/socket.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { YouTubePlayer} from '@angular/youtube-player';
import { Room } from 'src/app/model/room';
import { from } from 'rxjs';
import * as SocketIO from 'socket.io-client';
import { SocketEvent } from 'src/app/Enums';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
	@Output() public click: EventEmitter<MouseEvent> = new EventEmitter();

	onButtonClick(event: MouseEvent) {
		event.stopPropagation();
		this.click.emit(event);
	}

	public socket : SocketIOClient.Socket;
	@ViewChild(YouTubePlayer) youtubePlayer: YouTubePlayer;
	videoId: string;
	
	room : Room;
	id : any;

	addToQValue = '';
	lastState:YT.PlayerState = YT.PlayerState.UNSTARTED;

	constructor(private apiService: ApiService,private route: ActivatedRoute,private router: Router,private ngZone: NgZone, socketService:SocketService) {
		this.route.params.subscribe((params: Params) => {
			this.id = params['id'];
		});
		this.readRoom();
		this.socket = socketService.socket;
		this.socket.emit(SocketEvent.JOIN, this.id);
		this.socket.on(SocketEvent.PLAY, () => { this.youtubePlayer.playVideo();});
    	this.socket.on(SocketEvent.PAUSE, () => { 
			this.youtubePlayer.pauseVideo();
			
		});
		this.socket.on(SocketEvent.NEXT, () => { this.setVideoFromQueue(this.room.queue[0],0) });
		this.socket.on(SocketEvent.SYNCTIME, (time:number) => {
			if(Math.abs(this.youtubePlayer.getCurrentTime() - time) > 1){
				this.youtubePlayer.seekTo(time,true);
			}
		});
		this.socket.on(SocketEvent.ReadRoom, () => {this.readRoom()});
		
	}
	  
	ngOnInit() {
		let tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		let firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				
	}

	readRoom(){
		this.apiService.getRoom(this.id).subscribe((data) => {
		this.room = data;
		this.videoId = this.room.video;
		});
	}	
	
	onStateChange(event: YT.OnStateChangeEvent) {
		
		console.log(event.data);

		if(event.data == YT.PlayerState.PLAYING){
			// Everyone sync if video starts playing (will only sync if someone is more than 2 sec away)
			if(this.lastState != YT.PlayerState.PLAYING){
				this.socket.emit(SocketEvent.SYNCTIME,this.id, this.youtubePlayer.getCurrentTime());
			}
			this.socket.emit(SocketEvent.PLAY,this.id);
		}
		else if(event.data == YT.PlayerState.PAUSED){
			this.socket.emit(SocketEvent.PAUSE,this.id);
		}
		else if(event.data == YT.PlayerState.BUFFERING){
			
			if(this.lastState == YT.PlayerState.UNSTARTED){
				
			}
			// Pause -> Someone buffered mid video
			else if(this.lastState == YT.PlayerState.PLAYING){
				this.socket.emit(SocketEvent.PAUSE, this.id);
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

	setVideo(){
		//TODO get param if link
		this.room.video = this.addToQValue;
		this.updateRoom();
	}

	setVideoFromQueue(videoId:string, i:number){
		this.room.video = videoId;
		this.room.queue.splice(i, 1);
		this.updateRoom();
	}

	addToQueue(){
		//TODO get param if link
		this.room.queue.push(this.addToQValue);
		this.updateRoom();
	}

	removeFromQueue(i:number){
		this.room.queue.splice(i, 1);
		this.updateRoom();

	}

	updateRoom(){
		this.apiService.updateRoom(this.id,this.room).subscribe(
			(res) => {
			  console.log('Room updated!')
			  this.ngZone.run(() => this.router.navigateByUrl('/room/'+this.id))
			  this.socket.emit(SocketEvent.ReadRoom);
			}, (error) => {
			  console.log(error);
		});
		this.socket.emit(SocketEvent.ReadRoom, this.id);
		
	}
}
