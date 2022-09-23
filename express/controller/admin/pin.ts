import { Values } from "../../models/values";
import { BaseController } from "../base";
import { Express } from 'express';
import { User } from "../../models/user";
import { Pin } from "../../models/pin";
import { pash } from "../../util";

export class PinAdminController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        app.get('/api/admin/pins', this.authorize);
        app.get('/api/admin/pins', async (req, res) => {
            try {
                if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

                let pins: Pin[] = (await values.pins.find().toArray()) as any;
                if (!pins) return res.sendStatus(404);
    
                res.json(pins.map(pin => {
                    delete pin.pin;
                    return pin;
                }));
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });

        app.get('/api/admin/pins/:group', this.authorize);
        app.get('/api/admin/pins/:group', async (req, res) => {
            try {
                if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

                let pins: Pin[] = (await values.pins.find({ group: req.params.group }).toArray()) as any;
                if (!pins) return res.sendStatus(404);
    
                res.json(pins.map(pin => {
                    delete pin.pin;
                    return pin;
                }));
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
        
        app.put('/api/admin/pin', this.authorize);
        app.put('/api/admin/pin', async (req, res) => {
            try {
                if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);
            
                const data: Pin = req.body;
                if (
                    !data.pin || !data.name || !data.group ||
                    !data.pin.match(/^[a-zA-Z0-9]{6}$/) ||
                    !data.name.match(/^[a-zA-Z0-9ä-üÄ-Ü ]{1,64}$/) ||
                    !data.group.match(/^[a-zA-Z0-9ä-üÄ-Ü]{1,32}$/)
                ) return res.sendStatus(400);
                
                const pin: Pin = {
                    pin: pash(data.pin),
                    name: data.name,
                    group: data.group
                };

                if (await values.pins.findOne({ pin: pin.pin, group: pin.group })) return res.sendStatus(409);

                await values.pins.insertOne(pin as any);
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
        
        app.post('/api/admin/pin', this.authorize);
        app.post('/api/admin/pin', async (req, res) => {
            try {
                if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

                const data: Pin = req.body;
                if (!data._id) return res.sendStatus(400);

                if (!await values.pins.findOne<Pin>({ _id: data._id })) return res.sendStatus(404);
                
                const pin: Pin = {} as any;
                if (data.pin) {
                    if (
                        !data.pin.match(/^[a-zA-Z0-9]{6}$/)
                    ) return res.sendStatus(400);
                    pin.pin = pash(data.pin)
                }
                if (data.name) {
                    if (
                        !data.name.match(/^[a-zA-Z0-9ä-üÄ-Ü ]{1,64}$/) 
                    ) return res.sendStatus(400);
                    pin.name = data.name
                }
                if (data.group) {
                    if (
                        !data.group.match(/^[a-zA-Z0-9ä-üÄ-Ü]{1,32}$/)
                    ) return res.sendStatus(400);
                    pin.group = data.group;
                }

                if (await values.pins.findOne({ pin: pin.pin, group: pin.group })) return res.sendStatus(409);

                await values.pins.updateOne({ _id: data._id }, pin as any);
                res.sendStatus(200);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
        
        app.delete('/api/admin/pin/:id', this.authorize);
        app.delete('/api/admin/pin/:id', async (req, res) => {
            try {
                if (!(res.locals.user as User).groups.includes('admin')) return res.sendStatus(401);

                const result = await values.pins.deleteOne({ _id: req.params.id });
                if (result.deletedCount > 0) res.sendStatus(200);
                else res.sendStatus(404);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
}