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
    rooms: any = [];
    pw: string;
    constructor(private apiService: ApiService, socketService: SocketService, private titleService: Title) {
        this.socket = socketService.socket;
        this.titleService.setTitle("Admin Page");
    }

    ngOnInit() { }

    async readRooms(pw) {
        if (this.apiService.token) {
            (await this.apiService.adminGetRooms(pw)).subscribe((res: any) => {
                if (res.success) {
                    this.rooms = res.data;
                }
            });
        }

    }

    async removeRoom(pw, room, index) {
        if (this.apiService.token && window.confirm('Are you sure?')) {
            (await this.apiService.adminDeleteRoom(pw, room._id)).subscribe((res) => {
                if (res.success && res.response == "Room deleted successfully") {
                    this.rooms.splice(index, 1);
                }
            });
        }
    }
}
