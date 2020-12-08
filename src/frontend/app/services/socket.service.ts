import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    baseUrl;
    public socket: SocketIOClient.Socket;
    constructor() {
        if (window.origin.includes("localhost")) {
            this.baseUrl = "http://localhost:4000";
        }
        else {
            this.baseUrl = window.origin;
        }
        this.socket = io.connect(this.baseUrl, {
            reconnection: true,             // whether to reconnect automatically
            reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
            reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
            reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
            randomizationFactor: 0.5
        });
    }
}
