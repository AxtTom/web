import 'dotenv/config';
import { MongoClient } from 'mongodb';
import express from 'express';
import proxy from 'express-http-proxy';
import http from 'http';
import { createProxyServer } from 'http-proxy';
import { Server } from 'socket.io'
import nodemailer from 'nodemailer';

(async () => {
    const mongo = new MongoClient('mongodb://127.0.0.1:27017');
    console.log('Connecting to DB...');
    await mongo.connect();
    console.log('Connected to DB!');
    
    console.log('Starting server...');
    const app = express();
    const httpServer = http.createServer(app);
    const wsproxy = createProxyServer({ target: 'http://localhost:4200', ws: true });

    const io = new Server(httpServer);

    io.on('connection', (socket) => {
       socket.emit('connection');
       console.log(socket.id + ' connected!');
    });

    if (process.env.DEBUG) {
        app.use('/', proxy('127.0.0.1:4200'));
    }
    else {
        console.log(__dirname + '/angular/dist');
        app.use('/', express.static(__dirname + '/angular/dist/angular')); // TODO: Make sure path is right
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
})();