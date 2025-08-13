import { NextFunction, Request, Response } from "express";
import JwtUtil from "../../security/JwtUtil";

const BEARER = "Bearer ";

export function authenticate(req: Request & {user: string, role: string}, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (authHeader.startsWith(BEARER)) {
        const token = authHeader.substring(BEARER.length);
        const payload = JwtUtil.verifyToken(token);
        req.user = payload.sub;
        req.role = payload.role;
    } 
    
    next();
}