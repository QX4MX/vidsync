import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from 'src/app/model/room';

@Component({
	selector: 'app-room-list',
	templateUrl: './room-list.component.html',
	styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {

	Room: any = [];

	constructor(private apiService: ApiService) {
		console.log("Roomlist Called");
		this.readRoom();
	}

	ngOnInit() { }

	readRoom() {
		this.apiService.getRooms().subscribe((data) => {
			this.Room = data;
		})
	}
}