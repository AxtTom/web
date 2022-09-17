

export interface User {
    _id?: string;
    username: string;
    password: string;
    displayName: string;
    recoveryEmail?: string;
}