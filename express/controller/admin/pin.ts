import { Values } from "../../models/values";
import { BaseController } from "../base";
import { Express } from 'express';
import { User } from "../../models/user";
import { Pin } from "../../models/pin";

export class PinAdminController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        app.get('/api/admin/pins', this.authorize);
        app.get('/api/admin/pins', async (req, res) => {
            if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

            let pins: Pin[] = (await values.pins.find().toArray()) as any;
            if (!pins) return res.sendStatus(404);

            res.json(pins.map(pin => {
                delete pin.pin;
            }));
        });
        
        app.get('/api/admin/pin/:id', this.authorize);
        app.get('/api/admin/pin/:id', async (req, res) => {
            if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

            let pin = await values.pins.findOne<Pin>({ _id: req.params.id });
            if (!pin) return res.sendStatus(404);

            delete pin.pin;
            res.json(pin);
        });
        
        app.put('/api/admin/pin', this.authorize);
        app.put('/api/admin/pin', async (req, res) => {
            if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);
            
            const data: Pin = req.body;
            if (
                !data.pin || !data.name || !data.groups
                // TODO: check pin and name format
            ) return res.sendStatus(400);

            const pin: Pin = {
                pin: data.pin, // TODO: hash pin
                name: data.name,
                groups: data.groups
            };
            await values.pins.insertOne(pin as any);
        });
        
        app.post('/api/admin/pin', this.authorize);
        app.post('/api/admin/pin', async (req, res) => {
            if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

            const data: Pin = req.body;
            if (
                !data._id ||
                !data.pin ||
                !data.name ||
                !data.groups // TODO: Check format
            ) return res.sendStatus(400);

            if (!await values.pins.findOne<Pin>({ _id: data._id })) return res.sendStatus(404);

            const pin: Pin = {
                pin: data.pin, // TODO: hash pin
                name: data.name,
                groups: data.groups
            };
            await values.pins.updateOne({ _id: data._id }, pin as any);
        });
        
        app.delete('/api/admin/pin/:id', this.authorize);
        app.delete('/api/admin/pin/:id', async (req, res) => {
            if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

            const result = await values.pins.deleteOne({ _id: req.params.id });
            if (result.deletedCount > 0) res.sendStatus(200);
            else res.sendStatus(404);
        });
    }
}