import * as  bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User, IUser } from "../models/user";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../util/secret';


export class UserController {

    public async registerUser(req: Request, res: Response): Promise<void> {
        console.log("Api => Register");
        let existsAlready = await User.findOne({ username: req.body.username });
        if (existsAlready) {
            console.log("Failed : Username taken");
            res.status(201).send({ success: false, message: "Username taken" });
        }
        else {
            const newUser: IUser = new User(req.body);
            let user = await newUser.save(); // password will be hashed before.
            let token = jwt.sign({ user }, jwtSecret, { expiresIn: '30d' });
            console.log("Success : user created");
            let returnUser = {
                username: user.username,
                created_date: user.created_date,
            }
            res.status(200).send({ success: true, token: token, user: returnUser });
        }

    }

    public async authenticateUser(req: Request, res: Response) {
        console.log("Api => Login");
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log("Failed : doesnt exist");
            res.status(201).send({ success: false, message: "Login not Valid" });
        }
        else {
            if (await bcrypt.compare(req.body.password, user.password)) {
                let token = jwt.sign({ user }, jwtSecret, { expiresIn: '30d' });
                console.log("Success : logged in");
                let returnUser = {
                    username: user.username,
                    created_date: user.created_date,
                }
                res.status(200).send({ success: true, token: token, user: returnUser });
            }
            else {
                res.status(201).send({ success: false, message: "Login not Valid" });
            }
        }
    }

    public async authenticateUserWithToken(req: Request, res: Response) {
        console.log("Api => Login");
        let user = await User.findOne({ username: res.locals.username });
        if (!user) {
            console.log("Failed : doesnt exist");
            res.status(201).send({ success: false, message: "Not Valid" });
        }
        else {
            if (res.locals.password == user.password) {
                console.log("Success : GetUser");
                let returnUser = {
                    username: user.username,
                    created_date: user.created_date,
                }
                res.status(200).send({ success: true, token: res.locals.token, user: returnUser });
            }
            else {
                res.status(201).send({ success: false, message: "Not Valid" });
            }

        }
    }
}