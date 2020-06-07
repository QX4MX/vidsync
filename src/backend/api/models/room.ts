import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const RoomSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name'
    },
    privacy: {
        type: String,
    },
    permanent: {
        type: String
    },
    editable: {
        type: String
    },
    creator: {
        type: String
    },
    video: {
        type: String,
        default: "",
    },
    queue: {
        type: Array
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});