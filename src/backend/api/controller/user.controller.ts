import * as  bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User, IUser } from "../models/user";


export class UserController {

    public async registerUser(req: Request, res: Response): Promise<void> {
        /*  const newUser: IUser = new User(req.body);
         console.log(newUser);
         await newUser.save((err, newUser) => {
             if (err) {
                 console.log(err);
                 return res.json({ status: 422, data: 'User already exists' });
             }
             res.json({ status: res.status, data: newUser });
         });
  */
    }

    public async authenticateUser(req: Request, res: Response) {

    }
}