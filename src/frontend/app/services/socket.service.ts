import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketEvent } from '../Enums';

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    baseUrl;
    public socket: SocketIOClient.Socket;
    constructor() {
        if(window.origin.includes("localhost")){
            this.baseUrl = "http://localhost:4000";
        }
        else{
            this.baseUrl = window.origin;
        }
        console.log(this.baseUrl);
        console.log("Connecting Socket at " + this.baseUrl);

        this.socket = io.connect(this.baseUrl);
    }
}
