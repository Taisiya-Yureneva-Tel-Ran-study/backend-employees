import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class EmployeeNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmployeeNotFoundError";
    }
}

export class EmployeeExistsError extends Error {
    constructor(id: string) {
        super(`Employee with id '${id}' already exists. If you want to update their data, use patch request.`);
        this.name = "EmployeeExistsError";
    }
}

export default function errorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    res.statusCode = 400;
    let message = err.message;
    if (err instanceof EmployeeNotFoundError)
        res.statusCode = 404;
    if (err instanceof EmployeeExistsError)
        res.statusCode = 409;
    if (err instanceof ZodError) {
        message = err.issues.reduce((res, issue) => res + `${res ? "\n" : ""}${issue.path}: ${issue.message}`, "")
    }
    res.send(message);
}