import { Request, Response } from 'express';
import * as mongoose from 'mongoose';

import { DB } from '../Database';

export class AdminController{
    public checkPw (req: Request, res: Response) {    
        if(DB.instance.checkPw(req.query.pw)){
            res.json({success:"true"}); 
        }
        else{
            DB.instance.generateNewPw();
            res.json({success:"false"});      
        }
    }
}