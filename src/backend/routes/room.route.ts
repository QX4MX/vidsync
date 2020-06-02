import {RoomController} from '../controller/roomController';



export class RoomRoutes {
    public roomCtrl: RoomController = new RoomController();
    public routes(app:any): void {     
        app.get('/api/room' , this.roomCtrl.getRooms) 
        app.post('/api/room' ,this.roomCtrl.addNewRoom);
        app.get('/api/room/:roomID',this.roomCtrl.getRoomWithId)
        app.put('/api/room/:roomID',this.roomCtrl.updateRoom)
        app.delete('/api/room/:roomID',this.roomCtrl.deleteRoom);
    }
}