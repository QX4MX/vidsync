import { NextFunction, Request, Response, json } from "express";
import * as request from 'request';
import * as https from 'https';
import { recaptchaSecret } from '../../util/secret';



export class AuthController {
    constructor() {

    }

    async verifyGoogleToken(req: Request, res: Response, next: NextFunction) {
        var json = "";
        console.log("Api => Authenticate with GoogleToken");
        await https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.headers.authorization, (resp) => {
            if (resp.statusCode == 200) {
                resp.on('data', function (d) {
                    json += d.toString();

                });
                resp.on('end', function () {
                    const data = JSON.parse(json);
                    console.log(" Authenticated : ", data.name);
                    res.locals.authUserName = data.name;
                    return next();
                });
            }
            else {
                console.log(" Authentication failed");
                return res.status(resp.statusCode).json({ status: "error", code: "unauthorized" });
            }
        });
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
                    return res.status(201).json({ status: "error", code: "captcha failed" });

                }
                else {
                    //if passed response success message to client
                    console.log(" Captcha success");
                    return next();
                }
            })
        }


    }
}