import { Collection, Document } from 'mongodb';

export interface Values {
    users: Collection<Document>;
    sessions: Collection<Document>;
}