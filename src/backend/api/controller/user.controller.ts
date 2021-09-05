import * as  bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User, IUser } from "../models/user";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../util/secret';


export class UserController {

    public async newUser(req: Request, res: Response): Promise<void> {
        console.log("Api => create User!");
        const newUser: IUser = new User();
        let user = await newUser.save();
        let token = jwt.sign({ user }, jwtSecret, { expiresIn: '365d' });
        let returnUser = {
            username: user.username,
            created_date: user.created_date,
        }
        res.status(200).send({ success: true, token: token, user: returnUser });
    }

    public async getUser(req: Request, res: Response) {
        console.log("Api => " + res.locals.username + " Get User!");
        let user = await User.findById(res.locals.id);
        if (!user) {
            res.status(201).send({ success: false, message: "Not Valid" });
        }
        else {
            let returnUser = {
                username: user.username,
                created_date: user.created_date,
            }
            res.status(200).send({ success: true, token: res.locals.token, user: returnUser });
        }

    }

    public async updateUser(req: Request, res: Response) {
        console.log("Api => " + res.locals.username + " Update User!");
        let user = await User.findOneAndUpdate({ _id: res.locals.id }, req.body, { new: true }, (err, user) => {
            if (err) {
            }
            else if (!user) {
                res.status(201).send({ success: false, message: "Not Valid" });
            }
            else {
                let token = jwt.sign({ user }, jwtSecret, { expiresIn: '365' });
                let returnUser = {
                    username: user.username,
                    created_date: user.created_date,
                }
                res.status(200).send({ success: true, token: token, user: returnUser });
            }
        });
    }

}