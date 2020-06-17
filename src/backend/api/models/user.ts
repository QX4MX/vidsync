import { Document, Schema, Model, model, Error } from "mongoose";
import * as bcrypt from "bcrypt";

export interface IUser extends Document {
    username: string;
    password: string;
}

export const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre<IUser>("save", function save(next) {
    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(this.password, salt, (err: Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword: string, callback: any) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        callback(err, isMatch);
    });
};

export const User: Model<IUser> = model<IUser>("User", userSchema);