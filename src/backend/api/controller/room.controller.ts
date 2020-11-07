import { Request, Response } from 'express';
import { youtubeapi } from 'src/backend/ytapi';
import { Room, IRoom } from '../models/room';
export class RoomController {
    ytApi: youtubeapi;
    constructor(ytApi: youtubeapi){
        this.ytApi = ytApi;
    }

    public async getRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Get Room ", req.params.id);
        const room = await Room.findById(req.params.id);
        res.json({ success: true, data: room });
    }

    public async createRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room ");
        req.body.creatorid = res.locals.id;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom });
    }

    public async createRoomWithVideo(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room and set Video");
        req.body.creatorid = "Bot";
        req.body.video = req.params.videoID;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });
    }

    public async createRoomWithPlaylist(req: Request, res: Response): Promise<void> {
        console.log("Api => Create Room and set Playlist ");
        req.body.creatorid = "Bot";
        let videoIdList = await this.ytApi.getPlaylistVideos(req.params.listId);
        let queue = [];
        let firstVideoSet = false;
        for(let videoId of videoIdList){
            if(!firstVideoSet){
                req.body.video = videoId;
            }
            else{
                queue.push(videoId);
            }
        }
        req.body.queue = queue;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });

        
        
    }

    public async updateRoom(req: Request, res: Response): Promise<void> {
        console.log("Api => Update Room ", req.params.id);
        const room = await Room.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, room) => {
            if (err) {
                console.log(err);
            }
            else {
                res.json({ success: true, data: room });
            }
        });
    }
}