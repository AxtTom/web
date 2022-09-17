

export interface Session {
    _id?: string;
    userId: string;
    token: string;
    expires: number;
}