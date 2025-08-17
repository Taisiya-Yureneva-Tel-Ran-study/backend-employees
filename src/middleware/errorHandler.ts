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

export class UnathorizedError extends Error {
    constructor() {
        super(`You need to be authorized to access this resource.`);
        this.name = "UnathorizedError";
    }
}
export class ForbiddenError extends Error {
    constructor() {
        super(`You are not authorized to access this resource.`);
        this.name = "ForbiddenError";
    }
}

const ErrCodes: { [key: string]: number } = {
    "EmployeeNotFoundError": 404,
    "EmployeeExistsError": 409,
    "UnathorizedError": 401,
    "ForbiddenError": 403,
}

export default function errorHandler(err: Error, _: Request, res: Response, __: NextFunction) {
    res.statusCode = ErrCodes[err.name] || 400;
    let message = err.message;
    if (err instanceof ZodError) {
        message = err.issues.reduce((res, issue) => res + `${res ? "\n" : ""}${issue.path}: ${issue.message}`, "")
    }
    res.send(message);
}