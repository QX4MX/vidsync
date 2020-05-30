"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var room_1 = require("../models/room");
var Room = mongoose.model('Room', room_1.RoomSchema);
var RoomController = /** @class */ (function () {
    function RoomController() {
    }
    RoomController.prototype.getRooms = function (_req, res) {
        Room.find({}, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        });
    };
    RoomController.prototype.addNewRoom = function (req, res) {
        var newRoom = new Room(req.body);
        newRoom.save(function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        });
    };
    RoomController.prototype.getRoomWithId = function (req, res) {
        Room.findById(req.params.roomID, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        });
    };
    RoomController.prototype.updateRoom = function (req, res) {
        Room.findOneAndUpdate({ _id: req.params.roomID }, req.body, { new: true }, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        });
    };
    RoomController.prototype.deleteRoom = function (req, res) {
        Room.deleteOne({ _id: req.params.roomID }, function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' });
        });
    };
    return RoomController;
}());
exports.RoomController = RoomController;
