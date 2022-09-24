import crypto from 'crypto';
import { env } from 'process';

export function pash(password) {
    return crypto.createHash('sha512').update(password + env.PEPPER).digest('base64url');
}