import { NextFunction, Request, Response } from "express";

export function authorize(req: Request & {user: string, role: string}, res: Response, next: NextFunction) {
    if (req.role === 'ADMIN') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}