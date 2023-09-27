import { Document, Schema, Model, model, Error } from 'mongoose';

/**
 * Interface for the Room
 */
export interface IRoom extends Document {
    video: Array<String>;
    queue: Array<String[]>;
    userCount: number;
    creatorid: string;
    createAt: Date;
}

/**
 * Schema for the Room
 */

export const roomSchema = new Schema({
    video: {
        type: Array,
    },
    queue: {
        type: Array,
        default: new Array(),
    },
    history: {
        type: Array,
        default: new Array(),
    },
    userCount: {
        type: Number,
        default: 0,
    },
    creatorid: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
});

export const Room: Model<IRoom> = model<IRoom>('Room', roomSchema);
