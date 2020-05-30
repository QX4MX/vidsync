import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketEvent } from './Enums';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUri : string ="http://localhost:4000";
  public socket : SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(this.baseUri);
    this.socket.on(SocketEvent.ALERT, function(msg:string){
      alert(msg);
    });
   }
}
