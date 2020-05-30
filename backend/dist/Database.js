"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var DB = /** @class */ (function () {
    function DB() {
        mongoose_1.connect("mongodb://localhost:27017/db", { useNewUrlParser: true });
        this._db = mongoose_1.connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
    }
    DB.prototype.connected = function () {
        console.log('Mongoose has connected');
    };
    DB.prototype.error = function (error) {
        console.log('Mongoose has errored', error);
    };
    return DB;
}());
exports.DB = DB;
