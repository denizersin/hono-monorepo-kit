import { ENV } from '@server/env';
import jwt from 'jsonwebtoken';

export class JwtService {


    static verifyToken(token: string) {
        return jwt.verify(token, ENV.JWT_SECRET)
    }

    static signToken(payload: any) {
        return jwt.sign(payload, ENV.JWT_SECRET)
    }

    static decodeToken(token: string) {
        return jwt.decode(token)
    }

}

