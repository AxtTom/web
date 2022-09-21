import { Collection, Document } from "mongodb"


export class Values {
    users: Collection<Document>;
    sessions: Collection<Document>;
}