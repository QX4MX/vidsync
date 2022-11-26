import { NextFunction, Request, Response, json } from "express";
import * as request from 'request';
import * as https from 'https';
import { dcbot_pw, jwtSecret } from '../../util/secret';
import * as jwt from 'jsonwebtoken';


export class AuthController {
    constructor() {
    }

    async verifyJwtToken(req: Request, res: Response, next: NextFunction) {
        let token = req.headers.authorization;
        if (!token || token == "undefined") {
            res.status(201).send({ success: false, message: "no token" });
        }
        else {
            await jwt.verify(token, jwtSecret, function (err, decoded) {
                if (err) {
                    res.status(201).send({ success: false, message: "unauthorized" });
                }
                else if (decoded) {
                    res.locals.token = token;
                    res.locals.username = decoded.user.username;
                    res.locals.id = decoded.user._id;
                    return next();
                }
            });
        }
    }
    async auth_dcbot(req: Request, res: Response, next: NextFunction) {
        let token = req.headers.authorization;
        console.log(token);
        console.log(dcbot_pw);
        if (!token || token == "undefined") {
            res.status(201).send({ success: false, message: "no token" });
        }
        else {
            if (token != dcbot_pw) {
                res.status(403).send({ success: false, message: "unauthorized" });
            }
            else if (token == dcbot_pw) {
                return next();
            }
        }
    }
}