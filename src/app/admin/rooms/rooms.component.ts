import { Component, OnInit} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

	
  	Room:any = [];
	pw:string;
  	constructor(private apiService: ApiService) {
  	}

  	ngOnInit() {}

	onKeyPw(event){
		this.pw = event.target.value;
	}

	readRoom(){
		this.apiService.adminGetRooms(this.pw).subscribe((data) => {
			this.Room = data;
		})  
	}

	removeRoom(room, index) {
		if(window.confirm('Are you sure?')) {
			this.apiService.adminDeleteRoom(room._id,this.pw).subscribe((data) => {
				this.Room.splice(index, 1);
			}
		)}
	}

}
