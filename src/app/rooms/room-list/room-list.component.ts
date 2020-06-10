import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from 'src/app/model/room';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {

    Room: any = [];

    constructor(private apiService: ApiService, private titleService: Title) {
        console.log("Roomlist Called");
        this.readRoom();
        this.titleService.setTitle("vidsync - Public Rooms");
    }

    ngOnInit() { }

    readRoom() {
        this.apiService.getRooms().subscribe((data) => {
            this.Room = data;
        })
    }
}