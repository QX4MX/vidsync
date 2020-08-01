import * as  bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User, IUser } from "../models/user";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../util/secret';


export class UserController {

    public async newUser(req: Request, res: Response): Promise<void> {
        console.log("Api => Register");
        const newUser: IUser = new User();
        let user = await newUser.save();
        console.log(user.id);
        let token = jwt.sign({ user }, jwtSecret, { expiresIn: '30d' });
        console.log("Success : user created");
        let returnUser = {
            username: user.username,
            created_date: user.created_date,
        }
        res.status(200).send({ success: true, token: token, user: returnUser });
    }

    public async getUser(req: Request, res: Response) {
        console.log("Api => Login");
        let user = await User.findById(res.locals.id);
        if (!user) {
            console.log("Failed : doesnt exist");
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
}