import * as mongoose from 'mongoose';
import { RoomSchema } from '../models/room';
import { Request, Response } from 'express';

const Room = mongoose.model('Room', RoomSchema);
export class RoomController{

    public getRooms (_req: Request, res: Response) {      
        Room.find({}, (err, room) => {
            if(err){
                res.send(err);
            }
            res.json(room);
        });
    }

    public addNewRoom (req: Request, res: Response) {  
        let newRoom = new Room(req.body);
        newRoom.save((err, room) => {
            if(err){
                res.send(err);
            }    
            res.json(room);
        });
    }

    public getRoomWithId (req: Request, res: Response) {          
        Room.findById(req.params.roomID, (err, room) => {
            if(err){
                res.send(err);
            }
            res.json(room);
        });
    }

    public updateRoom (req: Request, res: Response) {   
        Room.findOneAndUpdate({ _id: req.params.roomID }, req.body, { new: true }, (err, room) => {
            if(err){
                res.send(err);
            }
            res.json(room);
        });
    }

    public deleteRoom (req: Request, res: Response) {       
        Room.deleteOne({ _id: req.params.roomID }, (err) => {
            if(err){
                res.send(err);
            }

            res.json({ message: 'Successfully deleted contact!'});
        });
    }
}