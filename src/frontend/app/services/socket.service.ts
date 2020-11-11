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
        console.log("Connecting Socket at " + this.baseUrl);

        this.socket = io.connect(this.baseUrl);
        this.socket.on(SocketEvent.CONNECT, () => {
            this.socket.connected = true;
            console.log("socket connected");
        });
        this.socket.on(SocketEvent.DISCONNECT, () => {
            console.log("socket disconnected");
            this.socket.connected = false;
            setTimeout(this.reconnectSocket,500);
        });
    }

    reconnectSocket(){
        if(!this.socket || !this.socket.connected){
            console.log("Reconnect");
            this.socket = io.connect(this.baseUrl);
        }
        else{
            setTimeout(this.reconnectSocket,1000);
        }
    }
}
