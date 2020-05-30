import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api-services/api.service';
import { Room } from 'src/app/model/room';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {
  
  	Room:any = [];

  	constructor(private apiService: ApiService) {
    	console.log("Roomlist Called");
    	this.readRoom();
  	}

  	ngOnInit() {}

	readRoom(){
		this.apiService.getRooms().subscribe((data) => {
			this.Room = data;
		})  
	}

	removeRoom(room, index) {
		if(window.confirm('Are you sure?')) {
			this.apiService.deleteRoom(room._id).subscribe((data) => {
				this.Room.splice(index, 1);
			}
		)}
	}
}