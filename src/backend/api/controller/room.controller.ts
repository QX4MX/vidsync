import { Request, Response } from 'express';
import { Room, IRoom } from '../models/room';
export class RoomController {

    public async getPublicRooms(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Public Rooms");
        const rooms = await Room.find({ privacy: 'Public' });
        res.json({ rooms });
    }

    public async getRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Room ", req.params.id);
        const room = await Room.findById(req.params.id);
        res.json(room);
    }

    public async createRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room ", req.body);
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
        console.log("Api => Delete Room ", req.params.id);
        await Room.findOneAndDelete({ roomId: req.params.id });
        res.json({ response: "Room deleted successfully" });
    }
}