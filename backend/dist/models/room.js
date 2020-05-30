"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.RoomSchema = new Schema({
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
