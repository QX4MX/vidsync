"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var bodyParser = require("body-parser");
var cors = require("cors");
var Enum_1 = require("./Enum");
var Database_1 = require("./Database");
var room_route_1 = require("./routes/room.route");
var AppServer = /** @class */ (function () {
    function AppServer() {
        this.app = express();
        this.router = express.Router();
        this.roomRoutes = new room_route_1.RoomRoutes();
        this.app = express();
        this.port = process.env.PORT || AppServer.PORT;
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        this.db = new Database_1.DB();
        this.roomRoutes.routes(this.app);
        this.listen();
    }
    AppServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on(Enum_1.SocketEvent.CONNECT, function (socket) {
            console.log("socket connected");
            socket.on(Enum_1.SocketEvent.JOIN, function (roomId) {
                socket.join(roomId);
            });
            socket.on(Enum_1.SocketEvent.PLAY, function (roomId) { _this.io.to(roomId).emit(Enum_1.SocketEvent.PLAY); });
            socket.on(Enum_1.SocketEvent.PAUSE, function (roomId) { _this.io.to(roomId).emit(Enum_1.SocketEvent.PAUSE); });
            socket.on(Enum_1.SocketEvent.NEXT, function (roomId) { _this.io.to(roomId).emit(Enum_1.SocketEvent.NEXT); });
            socket.on(Enum_1.SocketEvent.SYNCTIME, function (roomId, time) { _this.io.to(roomId).emit(Enum_1.SocketEvent.SYNCTIME, time); });
            socket.on(Enum_1.SocketEvent.ReadRoom, function (roomId) { _this.io.to(roomId).emit(Enum_1.SocketEvent.ReadRoom); });
        });
    };
    AppServer.prototype.getApp = function () {
        return this.app;
    };
    AppServer.PORT = 4000;
    return AppServer;
}());
exports.AppServer = AppServer;
var appserver = new AppServer();
