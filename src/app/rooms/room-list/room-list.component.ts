import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from 'src/app/model/room';
import { Title } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {
    getOwnRooms: boolean = false;
    rooms: any = [];
    authenticated: boolean;

    constructor(private router: Router, private apiService: ApiService, private authService: AuthService, private titleService: Title, private socketService: SocketService, private ngZone: NgZone) {
        //TODO differanciate between own private rooms / public rooms (prob by url)
        if (this.router.url === '/rooms/private') {
            this.getOwnRooms = true;
        }
        this.readRoom();
        console.log("Roomlist Called");
        this.titleService.setTitle("vidsync - Public Rooms");
        socketService.socket.emit('leave');
    }

    async ngOnInit() {
        if (await this.authService.checkIfUserAuthenticated()) {
            this.authenticated = true;
        }
        else {
            this.authenticated = false;
        }
    }

    async readRoom() {
        //TODO differanciate between own private rooms / public rooms (prob by url)
        if (this.getOwnRooms && await this.authService.checkIfUserAuthenticated()) {
            let val = await this.apiService.getOwnRooms();
            val.subscribe((data) => {
                console.log(data);
                let json = JSON.stringify(data);
                var obj = JSON.parse(json);
                this.rooms = obj.rooms;
            });
        }
        else if (this.getOwnRooms && !await this.authService.checkIfUserAuthenticated()) {
            this.authenticated = false;
        }
        else {
            let val = await this.apiService.getPublicRooms();
            val.subscribe((data) => {
                console.log(data);
                let json = JSON.stringify(data);
                var obj = JSON.parse(json);
                this.rooms = obj.rooms;
            });
        }

    }

    async deleteRoom(id, index) {
        if (this.getOwnRooms && await this.authService.checkIfUserAuthenticated()) {
            let val = await this.apiService.deleteRoom(id);
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

    routeToLogin() {
        this.router.navigate(['/login'], { queryParams: { returnUrl: 'rooms/private' } });
    }
    //TODO get UserCount in Room, Sort, Search
}