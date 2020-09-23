import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketEvent } from '../Enums';
import { baseUrl } from './baseUrl';

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    //https://angular.vidsync.de
    //http://localhost:4000
    public socket: SocketIOClient.Socket;
    constructor() {
        console.log("Connecting Socket at " + baseUrl);
        this.socket = io.connect(baseUrl);
    }
}
