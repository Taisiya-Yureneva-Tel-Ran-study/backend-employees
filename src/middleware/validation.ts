import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import _ from "lodash";

export function validateEmployee(scheme: ZodType<any, any, any>): (req: Request, _: Response, next: NextFunction) => void {
    return (req: Request, __: Response, next: NextFunction) => {
        scheme.parse(req.body);
        next();
    }
}
