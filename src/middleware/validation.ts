import { NextFunction, Request, Response } from "express";
import { Employee } from "../model/Employee";
import { InvalidEmployeeDataError } from "./errorHandler.ts";

export function validateEmployee(req: Request, _: Response, next: NextFunction) {
    const emp = req.body as Employee;
    if (!emp.fullName || emp.fullName.length < 1 || !emp.birthDate || emp.birthDate.length < 1 ||
        !emp.department || emp.department.length < 1 || !emp.salary || typeof emp.salary !== "number" ||
        Number.isNaN(Number(emp.salary))
    ) {
        throw new InvalidEmployeeDataError("Check that all employee data is correct and try again");
    }
    next();
}