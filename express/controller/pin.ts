import { Values } from '../models/values';
import { BaseController } from './base';
import { Express } from 'express';
import { Pin } from '../models/pin';
import argon2 from 'argon2';
import { env } from 'process';

export class PinController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        // Get Pin Data
        app.get('/api/pin', async (req, res) => {
            try {
                if (!req.headers.authorization) return res.sendStatus(401);
                let pin = await values.pins.findOne<Pin>({ pin: await argon2.hash(req.headers.authorization + env.PEPPER) });
                if (!pin) return res.sendStatus(404);
                delete pin.pin;
                res.json(pin);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
}