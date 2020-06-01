import { connect, connection, Connection, Schema } from 'mongoose';
import * as express from 'express';
import { Db } from 'mongodb';


export class DB {

    private static instance: DB;
    private _db: Connection; 

    private Room: any;
    constructor() {
        //local mongodb://db:27017/db
        connect("mongodb://data/db:27017/db",{ useNewUrlParser: true });
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

