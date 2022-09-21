import { Values } from "../models/values";
import { Express } from 'express';
import { User } from "../models/user";
import argon2d from "argon2";
import crypto from 'crypto';
import { Collection, Document } from 'mongodb';
import { env } from "process";
import { BaseController } from "./base";

export class AuthController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        // Authorize
        app.post('/api/auth', async (req, res) => {
            try {
                const data: {
                    method: 'password' | 'refreshToken',
                    username?: string,
                    password?: string,
                    refreshToken?: string
                } = req.body;

                switch (data.method) {
                    case 'password': {
                        if (!data.username || !data.password) return res.sendStatus(400);

                        const user = await values.users.findOne<User>({ username: data.username });
                        if (!user) return res.sendStatus(404);
                        if (!await argon2d.verify(user.password, data.password + data.username.toLowerCase() + env.PEPPER)) return res.sendStatus(401); // Conflict
                        
                        const session = {
                            user: user._id,
                            token: crypto.randomBytes(48).toString('base64'), // length = 64
                            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                            //refreshToken: crypto.randomBytes(48).toString('base64') TODO: ...
                        }
                        await values.sessions.insertOne(session);
                        res.json({
                            token: session.token,
                            expires: session.expires,
                            //refreshToken: session.refreshToken
                        });
                    }
                    break;
                    case 'refreshToken': {
                        return res.sendStatus(501);
                    }
                    break;

                    default: {
                        res.sendStatus(400);
                    }
                    break;
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });

        // Register
        app.put('/api/auth', async (req, res) => {
            try {
                const data: {
                    username: string,
                    password: string,
                    confirm: string
                } = req.body;

                if (await values.users.findOne({ username: data.username.toLowerCase() })) return res.sendStatus(409);

                if (
                    !data.username || !data.password || !data.confirm || 
                    data.password != data.confirm ||
                    !data.username.match(/^[0-9a-zA-Z].{3,24}$/) ||
                    !data.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+-=|\\]).{7,32}$/)
                ) return res.sendStatus(400);
                
                const user: User = {
                    displayName: data.username,
                    username: data.username.toLowerCase(),
                    password: await argon2d.hash(data.password + data.username.toLowerCase() + env.PEPPER),
                    groups: []
                };
                await values.users.insertOne(user as any);

                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });

        // Get Authorized User
        app.get('/api/auth', this.authorize);
        app.get('/api/auth', (req, res) => {
            let user: User = res.locals.user;
            delete user.password;
            res.json(user);
        });

        // Delete current Session
        app.delete('/api/auth', this.authorize);
        app.delete('/api/auth', async (req, res) => {
            try {
                let user: User = res.locals.user;
                await this.values.sessions.deleteMany({ user: user._id });
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        });
    }
}