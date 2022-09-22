export class User {
    _id?: string;
    username: string;
    password: string;
    displayName: string;
    groups: string[];
    pin?: string;
    //enabled? locked? logintries? lastlogin?
}