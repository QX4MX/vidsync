import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Room } from 'src/app/model/room';
import { Title } from '@angular/platform-browser';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';
import { SocketEvent } from 'src/app/Enums';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})

export class RoomListComponent implements OnInit {
    getOwnRooms: boolean = false;
    rooms: Array<Room> = [];
    searchResults: Array<Room> = [];
    authenticated: boolean;
    authenticatedUserName: string;

    constructor(private router: Router, private apiService: ApiService, private titleService: Title, private socketService: SocketService, private ngZone: NgZone) {
        //TODO differanciate between own private rooms / public rooms (prob by url)
        if (this.router.url === '/rooms/private') {
            this.getOwnRooms = true;
            this.titleService.setTitle("vidsync - Own Rooms");
        }
        else {
            this.titleService.setTitle("vidsync - Public Rooms");
        }
        this.readRoom();
        socketService.socket.emit('leave');


        socketService.socket.on(SocketEvent.GETACTIVEROOMS, (rooms: Array<Room>) => {
            this.searchResults = rooms;
        });
    }

    async ngOnInit() {
        if (this.apiService.user) {
            this.authenticated = true;
            this.authenticatedUserName = this.apiService.user.username;
        }
        else {
            this.authenticated = false;
        }
    }

    async readRoom() {
        if (this.getOwnRooms && this.apiService.user) {
            let val = await this.apiService.getOwnRooms();
            val.subscribe((res: any) => {
                if (res.success) {
                    this.rooms = res.data;
                    this.searchResults = this.rooms;
                    this.socketService.socket.emit(SocketEvent.GETACTIVEROOMS, this.searchResults);
                }
            });
        }
        else if (this.getOwnRooms && !(this.apiService.user)) {
            this.authenticated = false;
        }
        else {
            let val = await this.apiService.getPublicRooms();
            val.subscribe((res: any) => {
                if (res.success) {
                    this.rooms = res.data;
                    this.searchResults = this.rooms;
                    this.socketService.socket.emit(SocketEvent.GETACTIVEROOMS, this.searchResults);
                }

            });
        }
    }

    async deleteRoom(id, index) {
        if ((this.apiService.user)) {
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

    searchByName(searchStr: string) {
        this.searchResults = [];
        for (let room of this.rooms) {
            if (room.name.toLowerCase().indexOf(searchStr.toLowerCase()) != -1) {
                this.searchResults.push(room);
            }
        }
    }

    sortByNewestDate() {
        this.searchResults.sort((a: Room, b: Room) => {
            return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        });
    }
    sortByOldestDate() {
        this.searchResults.sort((a: Room, b: Room) => {
            return new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
        });
    }

    sortByMostUserCount() {
        this.searchResults.sort((a: Room, b: Room) => {
            return b.userCount - a.userCount;
        });
    }

    sortByLeastUserCount() {
        this.searchResults.sort((a: Room, b: Room) => {
            return a.userCount - b.userCount;
        });
    }
}