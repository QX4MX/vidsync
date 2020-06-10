import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    socket: SocketIOClient.Socket;;
    Room: any = [];
    pw: string;
    constructor(private apiService: ApiService, socketService: SocketService, private titleService: Title) {
        this.socket = socketService.socket;
        this.titleService.setTitle("Admin Page");
    }

    ngOnInit() { }

    setYTApiKey(ytApiKeyVal: string, pwVal: string) {
        this.socket.emit('setYTApi', pwVal, ytApiKeyVal);
    }

    readRoom(pwVal: string) {
        this.apiService.adminGetRooms(pwVal).subscribe((data) => {
            this.Room = data;
        })
    }

    removeRoom(room, index, pwVal) {
        if (window.confirm('Are you sure?')) {
            this.apiService.adminDeleteRoom(room._id, pwVal).subscribe((data) => {
                this.Room.splice(index, 1);
            }
            )
        }
    }
}
