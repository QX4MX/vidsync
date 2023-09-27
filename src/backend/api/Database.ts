import { connect, connection, Connection } from 'mongoose';

import { MONGODB_URI } from '../util/secret';

export class mongooseDB {
    public static instance: mongooseDB;
    private _db: Connection;

    /**
     * Creates an instance of mongooseDB.
     */
    constructor() {
        connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        mongooseDB.instance = this;
    }

    private connected() {
        console.log('DB => Mongoose has connected');
    }

    private error(error: any) {
        console.log('DB => Mongoose has errored', error);
    }
}
