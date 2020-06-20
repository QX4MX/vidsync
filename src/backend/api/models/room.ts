import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IRoom extends Document {
    name: String;
    video: String;
    queue: Array<String>;
    privacy: String;
    userCount: number;
    creator: String;
    created_date: Date;
}

export const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
    },
    queue: {
        type: Array,
        default: new Array()
    },
    privacy: {
        type: String,
    },
    userCount: {
        type: Number,
        default: 0
    },
    creator: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

export const Room: Model<IRoom> = model<IRoom>("Room", roomSchema);