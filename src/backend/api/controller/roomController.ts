import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { DB } from '../Database';
import { RoomSchema } from '../models/room';

const Room = mongoose.model('Room', RoomSchema);
export class RoomController{
    public getRooms (req: Request, res: Response) {
        console.log("Get All Rooms :",DB.instance.checkPw(req.query.pw));
        if(DB.instance.checkPw(req.query.pw)){
            Room.find({}, (err, room) => {
                if(err){
                    res.send(err);
                }
                res.json(room);
            });
        }
        else{
            res.status(401).send('PW didnt match');
        }
        
    }

    public getPublicRooms (_req: Request, res: Response) {      
        Room.find({privacy : 'Public'}, (err, room) => {
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
        console.log("Get All Rooms :",DB.instance.checkPw(req.query.pw));
        if(DB.instance.checkPw(req.query.pw)){
            Room.deleteOne({ _id: req.params.roomID }, (err) => {
                if(err){
                    res.send(err);
                }

                res.json({ message: 'Successfully deleted contact!'});
            });
        }
        else{
            res.status(401).send('PW didnt match');
        }
    }
}