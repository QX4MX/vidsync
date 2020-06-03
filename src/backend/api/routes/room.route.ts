import {RoomController} from '../controller/roomController';
import { DB } from '../Database';



export class RoomRoutes {
    roomCtrl: RoomController = new RoomController();;
        
    public routes(app:any): void {     
        //Rooms
        app.get('/api/admin/room' , this.roomCtrl.getRooms)
        app.get('/api/room' , this.roomCtrl.getPublicRooms) 
        app.post('/api/room' ,this.roomCtrl.addNewRoom);
        app.get('/api/room/:roomID',this.roomCtrl.getRoomWithId)
        app.put('/api/room/:roomID',this.roomCtrl.updateRoom)
        app.delete('/api/room/:roomID',this.roomCtrl.deleteRoom);
    }
}