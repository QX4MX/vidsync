import { connect, connection, Connection, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { MONGODB_URI } from '../util/secret';


export class mongooseDB {

    public static instance: mongooseDB;
    private _db: Connection;
    private passwordHash: any;

    constructor() {
        connect(MONGODB_URI, { useNewUrlParser: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        mongooseDB.instance = this;
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error: any) {
        console.log('Mongoose has errored', error);
    }
}



