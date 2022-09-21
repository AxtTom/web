import { Values } from "../models/values";
import { BaseController } from "./base";
import { Express } from "express";

export class PinController extends BaseController {
    constructor(app: Express, values: Values) {
        super(values);

        // Get Pin Data
        app.get('/api/pin', async (req, res) => {
            try {
                if (!req.headers.authorization) return res.sendStatus(401);
                
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
}