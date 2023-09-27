import { Document, Schema, Model, model } from 'mongoose';

/**
 * Interface for the User
 */
export interface IUser extends Document {
    username: string;
    created_date: Date;
}

/**
 * Schema for the User
 */
export const userSchema: Schema = new Schema({
    username: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
