import { NextFunction, Request, Response } from "express";
import JwtUtil from "../../security/JwtUtil.ts";

const BEARER = "Bearer ";

export function authenticate(req: Request & { user: string, role: string }, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith(BEARER)) {
        const token = authHeader.substring(BEARER.length);
        try {
            const payload = JwtUtil.verifyToken(token);
            req.user = payload.sub;
            req.role = payload.role;
        } catch (error) {
            res.status(401).send("Unauthorized");
            return;
        }
    } else {
        res.status(401).send("Unauthorized");
        return;
    }

    next();
}