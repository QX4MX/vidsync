import { connect, connection, Connection, Schema } from 'mongoose';


export class DB {

    private static instance: DB;
    private _db: Connection; 

    constructor() {
        //connect("mongodb://mongodb.default.svc.cluster.local:27017/vidsyncdb",{ useNewUrlParser: true });
        connect("mongodb://localhost:27017/vidsyncdb",{ useNewUrlParser: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error:any) {
        console.log('Mongoose has errored', error);
    }
}

