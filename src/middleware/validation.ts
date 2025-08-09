import { NextFunction, Request, Response } from "express";
import { Employee } from "../model/Employee";
import { ZodType } from "zod";
import _ from "lodash";

export function validateEmployee(scheme: ZodType<any, any, any>): (req: Request, _: Response, next: NextFunction) => void {
    return (req: Request, __: Response, next: NextFunction) => {

    const emp = req.body as Employee;
    if (!_.isEmpty(emp)) {
        scheme.parse(emp);
    }

    next();}
}