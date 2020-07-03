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
                    res.locals.password = decoded.user.password;
                    return next();
                }
            });
        }

    }

    async verifyGoogleCaptchaToken(req: Request, res: Response, next: NextFunction) {
        console.log("Api => Authenticate with Chaptcha-GoogleToken");
        let token = req.headers.authorization;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}&remoteip=${req.connection.remoteAddress}`;

        if (token === null || token === undefined) {
            console.log(" Failed Captcha Token is empty or invalid");
            res.status(201).send({ success: false, message: "Captcha Token is empty or invalid" });
        }
        else {
            request(url, function (err, response, body) {
                //the body is the data that contains success message
                body = JSON.parse(body);
                //check if the validation failed
                if (body.success !== undefined && !body.success) {
                    console.log(" Captcha failed");
                    res.status(201).send({ success: false, message: " Captcha failed" });
                }
                else {
                    //if passed response success message to client
                    console.log(" Captcha success");
                    return next();
                }
            })
        }
    }

    async verifyAdmin(req: Request, res: Response, next: NextFunction) {
        console.log("Admin => Authenticate with Token");
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
                else if (ADMINPW && decoded && req.headers.pw && req.headers.pw == ADMINPW) {
                    console.log(" Authenticated : ", decoded.user.username);
                    res.locals.token = token;
                    res.locals.username = decoded.user.username;
                    res.locals.password = decoded.user.password;
                    return next();
                }
                else {
                    console.log("unauthorized");
                    res.status(201).send({ success: false, message: "unauthorized" });
                }
            });
        }
    }
}