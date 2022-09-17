import 'dotenv/config';
import { MongoClient } from 'mongodb';
import express from 'express';
import proxy from 'express-http-proxy';
import http from 'http';
import { createProxyServer } from 'http-proxy';
import { Server } from 'socket.io'
import nodemailer from 'nodemailer';
import { Session } from './models/session';
import { Auth } from './models/auth';
import { User } from './models/user';
import argon2 from 'argon2';
import crypto from 'crypto';

(async () => {
    const mongo = new MongoClient('mongodb://127.0.0.1:27017');
    console.log('Connecting to DB...');
    await mongo.connect();
    console.log('Connected to DB!');

    const database = mongo.db('web');
    const users = database.collection('users');
    const sessions = database.collection('sessions');
    const tailer = database.collection('tailer');
    const food = database.collection('food');
    
    console.log('Starting server...');
    
    const app = express();
    app.use(express.json());

    const httpServer = http.createServer(app);
    const wsproxy = createProxyServer({ target: 'http://localhost:4200', ws: true });

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
       socket.emit('connection');
       console.log(socket.id + ' connected!');
    });

    
    app.get('/api/auth', (req, res) => {
        sessions.findOne<Session>({ token: req.headers.authorization }).then(async session => {
            if (!session) return res.sendStatus(401);
            if (session.expires < Date.now()) {
                await sessions.deleteOne({ _id: session._id});
                return res.sendStatus(401);
            }
            const user = await users.findOne<User>({ _id: session.userId });
            if (!user) {
                return res.sendStatus(401);
            }
            return res.send({
                username: user.username,
                displayName: user.displayName
            });
        });
    });

    app.post('/api/auth', async (req, res) => {
        if (!req.body) return res.sendStatus(400);
        
        const body: Auth = req.body;

        if (body.method == 'password') {
            const user = await users.findOne<User>({ username: body.username.toLowerCase() });
            if (!user) return res.sendStatus(404);
            if (await argon2.verify(user.password, body.password + user.username + process.env.PEPPER)) {
                const session: Session = {
                    userId: user._id,
                    token: crypto.randomBytes(48).toString('base64'),
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
                };
                await sessions.insertOne(session as any);
                return res.send(session.token);
            }
        }
        if (body.method == 'refresh_token') {
            return res.sendStatus(501);
        }
        
        res.sendStatus(400);
    });
    
    app.post('/api/register', async (req, res) => {
        if (!req.body) return res.sendStatus(400);

        const body: {
            username: string,
            password: string
        } = req.body;

        if (body.username && 
            body.username.match(/^[0-9a-zA-Z].{3,24}$/) &&
            !await users.findOne({ username: body.username.toLowerCase() }) &&

            body.password &&
            body.password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+-=|\\]).{7,32}$/)
        ) {
            const user: User = {
                username: body.username.toLowerCase(),
                password: await argon2.hash(body.password + body.username.toLowerCase() + process.env.PEPPER),
                displayName: body.username
            }
            await users.insertOne(user as any);
            return res.sendStatus(200);
        }

        res.sendStatus(400);
    });

    if (process.env.DEBUG) {
        app.use('/', proxy('127.0.0.1:4200'));
    }
    else {
        console.log(__dirname + '/angular/dist');
        app.use('/', express.static(__dirname + '/angular/dist/angular'));
    }

    httpServer.on('upgrade', (req, socket, head) => {
        if (req.url == '/ng-cli-ws') {
            console.log("proxying upgrade request", req.url);
            wsproxy.ws(req, socket, head);
        }
    });
    httpServer.listen(process.env.DEBUG ? 8080 : 8580, process.env.DEBUG ? '0.0.0.0' : '127.0.0.1', () => {
        console.log(`Server running on ${process.env.DEBUG ? 8080 : 8580}!`);
    });

    process.on('uncaughtException', (err) => {
        console.log(err);
    });
})();