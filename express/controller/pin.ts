import { Values } from '../models/values';
import { BaseController } from './base';
import { Express } from 'express';
import { Pin } from '../models/pin';
import { env } from 'process';

export class PinController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        // Get Pin Data
        app.get('/api/pin', this.pinAuthorize);
        app.get('/api/pin', async (req, res) => {
            try {
                delete res.locals.pin.pin;
                return res.json(res.locals.pin);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
}