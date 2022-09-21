import { Values } from "../models/values";
import { Express } from 'express';
import { User } from "../models/user";
import argon2d from "argon2";
import crypto from 'crypto';

export class AuthController {
    constructor(app: Express, values: Values) {
        app.post('auth', async (req, res) => {
            //TODO: Add try/catch for 501

            const data: { // TODO: force template on body (after method check?)
                method: 'password', // | 'refreshToken'
                username: string,
                password: string // ^ to enforce this and not name?
            } = req.body;        // or both for method something checks i dont care

            if (data.method == 'password') {
                const user = await values.users.findOne<User>({ username: data.username });
                if (!user) return res.sendStatus(404);
                if (!await argon2d.verify(user.password, data.password)) return res.sendStatus(0); // TODO: Wrong password code ???
                const session = {
                    user: user._id,
                    token: crypto.randomBytes(85).toString('base64'), // TODO: Byte size for token length 64?
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
                    // TODO: Add refresh token
                }
                await values.sessions.insertOne(session);
                res.json({
                    token: session.token
                });
            }

            res.sendStatus(501); // TODO: or 503?
        });
    }
}