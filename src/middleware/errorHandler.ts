import { NextFunction, Request, Response } from "express";

export class EmployeeNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmployeeNotFoundError";
    }
}

export class InvalidEmployeeDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidEmployeeDataError";
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
    if (err instanceof EmployeeNotFoundError)
        res.statusCode = 404;
    res.send(err.message);
}