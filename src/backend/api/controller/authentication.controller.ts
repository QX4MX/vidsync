import * as jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

import { dcbot_pw, jwtSecret } from '../../util/secret';

export class AuthController {
    /**
     * Verifies the JWT token
     * @param req - Request
     * @param res - Response
     * @param next - NextFunction
     */
    async verifyJwtToken(req: Request, res: Response, next: NextFunction) {
        let token = req.headers.authorization;
        if (!token || token == 'undefined') {
            res.status(401).send({ success: false, message: 'no token' });
        } else {
            await jwt.verify(token, jwtSecret, function (err, decoded) {
                if (err) {
                    res.status(401).send({
                        success: false,
                        message: 'unauthorized',
                    });
                } else if (decoded) {
                    res.locals.token = token;
                    res.locals.username = decoded.user.username;
                    res.locals.id = decoded.user._id;
                    return next();
                }
            });
        }
    }

    /**
     * Verifies the DC-Bot password
     * @param req - Request
     * @param res - Response
     * @param next - NextFunction
     */
    async auth_dcbot(req: Request, res: Response, next: NextFunction) {
        let token = req.headers.authorization;
        if (!token || token == 'undefined') {
            res.status(201).send({ success: false, message: 'no token' });
        } else {
            if (token != dcbot_pw) {
                res.status(401).send({
                    success: false,
                    message: 'unauthorized',
                });
            } else if (token == dcbot_pw) {
                return next();
            }
        }
    }
}
