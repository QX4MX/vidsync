import { Request, Response } from 'express';
import { Room, IRoom } from '../models/room';
export class RoomController {

    public async getPublicRooms(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Public Rooms");
        const rooms = await Room.find({ privacy: 'Public' });
        res.json({ rooms });
    }

    public async getOwnRooms(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Own Rooms of ", res.locals.authUserName);
        const rooms = await Room.find({ creator: res.locals.authUserName });
        res.json({ rooms });
    }

    public async getRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Room ", req.params.id);
        const room = await Room.findById(req.params.id);
        res.json(room);
    }

    public async createRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room ", req.body);
        req.body.privacy = 'Public';
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ status: res.status, data: newRoom });
    }

    public async createOwnRoom(req: Request, res: Response): Promise<void> {
        req.body.creator = res.locals.authUserName;
        console.log("Api => " + req.body.creator + "create Room ", req.body);
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ status: res.status, data: newRoom });
    }

    public async updateRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Update Room ", req.params.id);
        const room = await Room.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.json(room);
    }

    public async deleteRoom(req: Request, res: Response): Promise<void> {
        await Room.findOneAndDelete({ _id: req.params.id, creator: res.locals.authUserName }, (err, resp) => {
            if (resp) {
                console.log("Api => " + res.locals.authUserName + " deleted Room " + req.params.id);
                res.json({ response: "Room deleted successfully" });
            }
            else if (err) {
                console.log("Api => Room NOT deleted" + req.params.id);
                console.log(err);
                res.json({ response: "Room not deleted" });
            }
            else {
                console.log("Api => Room NOT deleted" + req.params.id);
                res.json({ response: "Room NOT deleted" });
            }
        });
    }

    public async adminGetRooms(req: Request, res: Response): Promise<void> {
        console.log("ADMIN => Get Rooms");
        const rooms = await Room.find();
        res.json({ rooms });
    }

    public async adminDeleteRoom(req: Request, res: Response): Promise<void> {
        console.log(req.params.id);
        await Room.findOneAndDelete({ _id: req.params.id }, (err, resp) => {
            if (resp) {
                console.log("ADMIN => Deleted Room " + req.params.id);
                res.json({ response: "Room deleted successfully" });
            }
            else if (err) {
                console.log("ADMIN => Room NOT deleted " + req.params.id + " " + err);
                console.log(err);
                res.json({ response: "Room NOT deleted" });
            }
            else {
                console.log("ADMIN => Room NOT deleted " + req.params.id);
                res.json({ response: "Room NOT deleted" });
            }
        });
    }

}