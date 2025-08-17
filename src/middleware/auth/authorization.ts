import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errorHandler.ts";

export function authorize(roles: string[]): (req: Request & {user: string, role: string}, res: Response, next: NextFunction) => void {
    return (req: Request & {user: string, role: string}, res: Response, next: NextFunction) => {
    if (roles.includes(req.role)) {
        next();
    } else {
        throw new ForbiddenError();
    }
}
}