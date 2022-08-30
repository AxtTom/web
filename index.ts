import 'dotenv/config';
import { MongoClient } from 'mongodb';
import express from 'express';
import proxy from 'express-http-proxy';

(async () => {
    const mongo = new MongoClient('mongodb://127.0.0.1:27017');
    console.log('Connecting to DB...');
    await mongo.connect();
    console.log('Connected to DB!');

    console.log('Starting server...');
    const app = express();

    if (process.env.DEBUG) {
        app.use('/', proxy('127.0.0.1:4200'));
    }
    else {
        app.use('/', express.static(__dirname + '/angular/dist')); // TODO: Make sure path is right
    }

    app.listen(process.env.DEBUG ? 8080 : 8580, process.env.DEBUG ? '0.0.0.0' : '127.0.0.1', () => {
        console.log(`Server running on ${process.env.DEBUG ? 8080 : 8580}!`);
    });
})();