import { NextFunction, Request, Response, json } from "express";
import * as request from 'request';
import * as https from 'https';
import { ADMINPW, recaptchaSecret, jwtSecret } from '../../util/secret';
import * as jwt from 'jsonwebtoken';


export class AuthController {
    constructor() {
    }

    async verifyJwtToken(req: Request, res: Response, next: NextFunction) {
        console.log("Api => Authenticate with Token");
        let token = req.headers.authorization;
        if (!token || token == "undefined") {
            console.log(" Failed Token is empty or invalid");
            res.status(201).send({ success: false, message: "no token" });
        }
        else {
            await jwt.verify(token, jwtSecret, function (err, decoded) {
                if (err) {
                    console.log("JWT TOKEN NOT VALID");
                    res.status(201).send({ success: false, message: "unauthorized" });
                }
                else if (decoded) {
                    console.log(" Authenticated : ", decoded.user.username);
                    res.locals.token = token;
                    res.locals.username = decoded.user.username;
                    res.locals.id = decoded.user.id;
                    return next();
                }
            });
        }

    }
}