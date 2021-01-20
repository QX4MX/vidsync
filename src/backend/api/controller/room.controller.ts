import { Request, Response } from 'express';
import { youtubeapi } from 'src/backend/ytapi';
import { Room, IRoom } from '../models/room';
export class RoomController {

    constructor(private ytApi: youtubeapi) {
        this.createRoomWithPlaylist = this.createRoomWithPlaylist.bind(this);
    }

    public async getRoom(req: Request, res: Response) {
        console.log("Api => " + res.locals.username + " get Room " + req.params.id);

        const room = await Room.findById(req.params.id);
        res.json({ success: true, data: room });
    }

    public async createRoom(req: Request, res: Response) {
        console.log("Api => " + res.locals.username + " create Room!");
        req.body.creatorid = res.locals.id;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom });
    }

    public async createRoomWithVideo(req: Request, res: Response) {
        req.body.creatorid = "Bot";
        req.body.video = req.params.videoID;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });
    }

    public async createRoomWithPlaylist(req: Request, res: Response) {
        req.body.creatorid = "Bot";
        let queue = [];
        let firstVideoSet = false;
        let results = await this.ytApi.getPlaylistVideos(req.params.listId);
        for (let video of results) {
            if (!firstVideoSet) {
                req.body.video = video[0];
                firstVideoSet = true;
            }
            else {
                queue.push(video[0]);
            }
        }
        req.body.queue = queue;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });
    }

    public async updateRoom(req: Request, res: Response) {
        console.log("Api =>  " + res.locals.username + " Update Room " + req.params.id);
        const room = await Room.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, room) => {
            if (err) {
                console.log(err);
                res.json({ success: false });
            }
            else {
                res.json({ success: true, data: room });
            }
        });
    }
}