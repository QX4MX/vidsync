import { Document, Schema, Model, model, Error } from "mongoose";
import * as bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    created_date: Date;
}

export const userSchema: Schema = new Schema({
    username: {
        type: String,
        default: "AnonymousUser",
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

export const User: Model<IUser> = model<IUser>("User", userSchema);