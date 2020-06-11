import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from 'src/app/model/room';
import { Title } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {

    Room: any = [];

    constructor(private apiService: ApiService, private titleService: Title, private socketService: SocketService) {
        console.log("Roomlist Called");
        this.readRoom();
        this.titleService.setTitle("vidsync - Public Rooms");
        socketService.socket.emit('leave');
    }

    ngOnInit() { }

    readRoom() {
        this.apiService.getRooms().subscribe((data) => {
            this.Room = data;
        })
    }
}