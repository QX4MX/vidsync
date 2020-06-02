import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketEvent } from '../Enums';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //https://angular.vidsync.de
  //http://localhost:4000
  private baseUri : string ="https://angular.vidsync.de";
  public socket : SocketIOClient.Socket;
  constructor() {
    this.socket = io.connect(this.baseUri);
    this.socket.on(SocketEvent.ALERT, function(msg:string){
      alert(msg);
    });
   }
}
