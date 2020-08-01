import { Request, Response } from 'express';
import { Room, IRoom } from '../models/room';
export class RoomController {

    public async getRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Room ", req.params.id);
        const room = await Room.findById(req.params.id);
        res.json({ success: true, data: room });
    }

    public async createRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room ", req.body);
        req.body.creatorid = res.locals.id;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom });
    }

    public async updateRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Update Room ", req.params.id);
        const room = await Room.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.json({ success: true, data: room });
    }
}