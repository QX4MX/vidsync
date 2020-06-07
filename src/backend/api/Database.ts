import { connect, connection, Connection, Schema } from 'mongoose';
import { createHash } from '../utility';
import { baseUrl } from './dbUrl';


export class DB {

    public static instance: DB;
    private _db: Connection;
    private passwordHash: any;

    constructor() {
        this.generateNewPw();
        //mongodb.default.svc.cluster.local
        //mongodb://localhost:27017/vidsyncdb
        connect(baseUrl, { useNewUrlParser: true });
        //connect("mongodb://localhost:27017/vidsyncdb",{ useNewUrlParser: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);
        DB.instance = this;
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error: any) {
        console.log('Mongoose has errored', error);
    }

    private generateNewPw() {
        let password = '_' + Math.random().toString(36).substr(2, 9);
        console.log(password);
        this.passwordHash = createHash(password);
    }

    public checkPw(pw: string) {
        if (pw && this.passwordHash == createHash(pw)) {
            return true;
        }
        return false;
    }
}



