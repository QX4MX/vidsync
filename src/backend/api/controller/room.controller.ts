import { Request, Response } from 'express';

import { Room, IRoom } from '../models/room';
import { youtubeapi } from '../../ytapi';

export class RoomController {
    /**
     * Creates an instance of RoomController.
     * @param ytApi - Youtube API
     */
    constructor(private ytApi: youtubeapi) {
        this.createRoomWithPlaylist = this.createRoomWithPlaylist.bind(this);
    }

    /**
     * Returns room with id in req.params.id
     * @param req
     * @param res
     */
    public async getRoom(req: Request, res: Response) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            const room = await Room.findById(req.params.id);
            res.json({ success: true, data: room });
        } else {
            res.json({ success: false });
        }
    }

    /**
     * Creates a new room
     * @param req
     * @param res
     */
    public async createRoom(req: Request, res: Response) {
        req.body.creatorid = res.locals.id;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom });
        console.log(
            'Api => ' + res.locals.username + ' create Room! ' + newRoom.id
        );
    }

    /**
     * Creates a new room with an initial video
     * @param req
     * @param res
     */
    public async createRoomWithVideo(req: Request, res: Response) {
        req.body.creatorid = 'Bot';
        //TODO twitch vods via bot
        req.body.video = ['youtube', req.params.videoID];
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });
        console.log('Api => Bot create Room! ' + newRoom.id);
    }

    /**
     * Creates a new room with a playlist
     * @param req
     * @param res
     */
    public async createRoomWithPlaylist(req: Request, res: Response) {
        req.body.creatorid = 'DC-Bot';
        let queue = [];
        let firstVideoSet = false;
        let results = await this.ytApi.getPlaylistVideos(req.params.listId);
        //TODO twitch vods via bot
        for (let video of results) {
            if (!firstVideoSet) {
                req.body.video = ['youtube', video[0]];
                firstVideoSet = true;
            } else {
                queue.push(['youtube', video[0]]);
            }
        }
        req.body.queue = queue;
        const newRoom: IRoom = new Room(req.body);
        await newRoom.save();
        res.json({ success: true, data: newRoom.id });
    }

    /**
     * Updates a room with id in req.params.id
     * @param req
     * @param res
     */
    public async updateRoom(req: Request, res: Response) {
        const room = await Room.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true },
            (err, room) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false });
                } else {
                    res.json({ success: true, data: room });
                }
            }
        );
    }
}
