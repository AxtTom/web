import 'dotenv/config';
import './environment.json';
import { MongoClient, Collection, Document } from 'mongodb';
import { env } from 'process';
import express from 'express';
import http from 'http';

(async () => {
    const values = {
        users: Collection<Document>
    };
    
    console.log('Connecting to MongoDB...');
    const mongo = new MongoClient(env.MONGOURL);
    await mongo.connect();
    const db = mongo.db(env.MONGONAME);
    values.users = db.collection('users');
    console.log('Connected to MongoDB!');

    console.log('Starting Server...');
    const app = express();
    app.use(express.json());

    const server = http.createServer(app);

    server.listen(env.PORT, parseInt(env.BIND), () => {
        console.log('Server started!');
    });
})();