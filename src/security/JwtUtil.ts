import jwt, { JwtPayload } from 'jsonwebtoken';
import Account from '../model/Account';
import "dotenv/config";

export default class JwtUtil {
    static getJwt(account: Account): string {
        return jwt.sign({role: account.role}, process.env.JWT_SECRET, {subject: account.userName});
    }

    static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    }
}