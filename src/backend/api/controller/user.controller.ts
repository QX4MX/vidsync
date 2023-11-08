import * as jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import { User, IUser } from '../models/user';
import { jwtSecret } from '../../util/secret';

export class UserController {
    /**
     * Creates a new User with the username Guest-<Date.now()> and returns a JWT token
     * @param req
     * @param res
     */
    public async newUser(req: Request, res: Response): Promise<void> {
        console.log('Api => create User!');
        const user: IUser = new User();
        user.username = 'Guest-' + Date.now();
        let token = jwt.sign({ user }, jwtSecret, { expiresIn: '30d' });
        let returnUser = {
            username: user.username,
            created_date: user.created_date,
        };

        let newUser = await user.save();
        res.status(200).send({ success: true, token: token, user: newUser });
    }

    /**
     * Returns the user with the id in res.locals.id
     * @param req
     * @param res
     */
    public async getUser(req: Request, res: Response) {
        let user = await User.findById(res.locals.id);
        if (!user) {
            res.status(401).send({ success: false, message: 'Not Valid' });
        } else {
            let returnUser = {
                username: user.username,
                created_date: user.created_date,
            };
            res.status(200).send({
                success: true,
                token: res.locals.token,
                user: returnUser,
            });
        }
    }

    /**
     * Updates the user with the id in res.locals.id
     * @param req
     * @param res
     */
    public async updateUser(req: Request, res: Response) {
        let user = await User.findOneAndUpdate({ _id: res.locals.id }, req.body, { new: true }, (err, user) => {
            if (err) {
            } else if (!user) {
                res.status(401).send({
                    success: false,
                    message: 'Not Valid',
                });
            } else {
                let token = jwt.sign({ user }, jwtSecret, {
                    expiresIn: '365d',
                });
                let returnUser = {
                    username: user.username,
                    created_date: user.created_date,
                };
                res.status(200).send({
                    success: true,
                    token: token,
                    user: returnUser,
                });
            }
        });
    }
}
