import 'dotenv/config';
import environments from './environments.json';
import { MongoClient, Collection, Document } from 'mongodb';
import { env } from 'process';
import express from 'express';
import http from 'http';
import proxy from 'express-http-proxy';
import { AuthController } from './controller/auth';
import { Values } from './models/values';
import { User } from './models/user';
import crypto from 'crypto';
import { PinController } from './controller/pin';
import { PinAdminController } from './controller/admin/pin';
import { pash } from './util';

(async () => {
    // Check .env
    if (
        !env.ENVIRONMENT ||
        !env.PEPPER
    ) {
        throw '.env not correct!';
    }
    const environment = environments[env.ENVIRONMENT];

    let values: Values = {} as any;
    
    console.log('Connecting to MongoDB...');
    const mongo = new MongoClient(environment.mongoUrl);
    await mongo.connect();
    const db = mongo.db(environment.mongoDatabase);
    values.users = db.collection('users');
    values.sessions = db.collection('sessions');
    values.pins = db.collection('pins');
    console.log('Connected to MongoDB!');

    if (!await values.users.findOne({ username: 'admin' })) {
        const password = crypto.randomBytes(12).toString('base64url');
        const user: User = {
            displayName: 'Admin',
            username: 'admin',
            password: pash(password + 'admin'),
            groups: [
                'admin'
            ]
        };
        await values.users.insertOne(user as any);
        console.log('Admin user with password: ' + password);
    }

    console.log('Starting Server...');
    const app = express();
    app.use(express.json());

    const server = http.createServer(app);

    new AuthController(app, values);
    new PinController(app, values);

    new PinAdminController(app, values);

    // TODO: root rewrite?
    if (env.ENVIRONMENT == 'DEBUG') {
        //app.use('/', proxy('127.0.0.1:4200'));
        app.get('/', (req, res) => res.send('no frontend'));
    }
    else if (env.ENVIRONMENT == 'RELEASE') {
        app.use('/', express.static(__dirname + '../angular/dist/angular'));
    }

    server.listen(environment.port, environment.bind, () => {
        console.log(`Server started on ${environment.bind}:${environment.port}!`);
    });

    if (env.ENVIRONMENT == 'RELEASE') {
        process.on('uncaughtException', (error) => {
            console.log('Uncaught: ' + error);
        });
    }
})()
.then(() => {
    console.log('main() finished!');
})
.catch((error) => {
    console.log(error);
});