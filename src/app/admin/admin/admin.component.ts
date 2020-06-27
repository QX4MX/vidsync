import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    socket: SocketIOClient.Socket;;
    rooms: any = [];
    pw: string;
    constructor(private apiService: ApiService, socketService: SocketService, private titleService: Title, private authService: AuthService) {
        this.socket = socketService.socket;
        this.titleService.setTitle("Admin Page");
    }

    ngOnInit() { }

    async readRooms() {
        if (await this.authService.checkIfUserAuthenticated()) {
            let val = await this.apiService.adminGetRooms();
            val.subscribe((data) => {
                console.log(data);
                let json = JSON.stringify(data);
                var obj = JSON.parse(json);
                this.rooms = obj.rooms;
            });
        }

    }


    async removeRoom(room, index) {
        if (await this.authService.checkIfUserAuthenticated() && window.confirm('Are you sure?')) {
            let val = await this.apiService.adminDeleteRoom(room._id);
            val.subscribe((data) => {
                console.log(data);
                let json = JSON.stringify(data);
                var obj = JSON.parse(json);
                if (obj.response == "Room deleted successfully") {
                    this.rooms.splice(index, 1);
                }
            });
        }
    }
}
