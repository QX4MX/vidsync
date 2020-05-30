"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roomController_1 = require("../controller/roomController");
var RoomRoutes = /** @class */ (function () {
    function RoomRoutes() {
        this.roomCtrl = new roomController_1.RoomController();
    }
    RoomRoutes.prototype.routes = function (app) {
        app.get('/api/room', this.roomCtrl.getRooms);
        app.post('/api/room', this.roomCtrl.addNewRoom);
        app.get('/api/room/:roomID', this.roomCtrl.getRoomWithId);
        app.put('/api/room/:roomID', this.roomCtrl.updateRoom);
        app.delete('/api/room/:roomID', this.roomCtrl.deleteRoom);
    };
    return RoomRoutes;
}());
exports.RoomRoutes = RoomRoutes;
