import { NextFunction, Request, Response } from "express";
import * as https from 'https';


export class AuthController {
    constructor() {

    }

    async verify(req: Request, res: Response, next: NextFunction) {
        await https.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.headers.authorization, (resp) => {
            if (resp.statusCode == 200) {
                return next();
            }
            else {
                return res.status(resp.statusCode).json({ status: "error", code: "unauthorized" });
            }
        });
    }
}