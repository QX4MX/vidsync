import { NextFunction, Request, Response, json } from "express";
import * as https from 'https';


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
                    console.log("Authenticated : ", data.name);
                    res.locals.authUserName = data.name;
                    return next();
                });
            }
            else {
                return res.status(resp.statusCode).json({ status: "error", code: "unauthorized" });
            }
        });
    }
}