import { Values } from "../models/values";


export class BaseController {
    values: Values;

    constructor(values: Values) {
        this.authorize = this.authorize.bind(this);
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
}