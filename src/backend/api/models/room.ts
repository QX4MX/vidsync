import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IRoom extends Document {
    video: String;
    queue: Array<String>;
    userCount: number;
    creatorid: string;
    createAt: Date;
}

export const roomSchema = new Schema({
    video: {
        type: String,
    },
    queue: {
        type: Array,
        default: new Array()
    },
    userCount: {
        type: Number,
        default: 0
    },
    creatorid: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now,
        expires: 43200
    }
});

export const Room: Model<IRoom> = model<IRoom>("Room", roomSchema);