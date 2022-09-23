import { Pin } from "../models/pin";
import { Values } from "../models/values";
import { env } from "process";
import { pash } from "../util";

export class BaseController {
    values: Values;

    constructor(values: Values) {
        this.authorize = this.authorize.bind(this);
        this.pinAuthorize = this.pinAuthorize.bind(this);
        this.values = values;
    }
    
    async authorize(req, res, next) {
        try {
            if (!req.headers.authorization) return res.sendStatus(401);
            const session = await this.values.sessions.findOne({ token: req.headers.authorization });
            if (!session || session.expires < Date.now()) return res.sendStatus(401);
            const user = await this.values.users.findOne({ _id: session.user });
            if (!user) return res.sendStatus(401);
            res.locals.session = session;
            res.locals.user = user;
            next();
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }

    async pinAuthorize(req, res, next) {
        try {
            const data = {
                pin: req.headers.authorization.split(';')[0],
                group: req.headers.authorization.split(';')[1] // TODO: group with spaces and find in url hashed or url space codes??
            } 

            const pins: Pin[] = (await this.values.pins.find({ group: data.group }).toArray()) as any;
            for (const pin of pins) {
                if (pin.pin == pash(data.pin)) {
                    res.locals.pin = pin;
                    return next();
                }
            }
            res.sendStatus(404);
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
}