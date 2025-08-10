import StoreEmployeesService from "./StoreEmployeesService.ts";
import { Employee } from "../model/Employee.ts";
import { readFileSync } from "node:fs";
import { validateEmployeeJson } from "../middleware/validation.ts";
import { EmployeeScheme } from "../middleware/schemes.ts";
import { ZodError } from "zod";

class StoreEmployeesFileService implements StoreEmployeesService {
    fetchEmployees(filename: string): Employee[] {
        let emps = new Array<Employee>;
        try {
            const res = readFileSync(filename, { "encoding": "utf-8" });
            emps = JSON.parse(res).map((emp: Employee) => {
                return validateEmployeeJson(EmployeeScheme, emp);
            });
        } catch (err) {
            let message = err.message;
            if (err instanceof ZodError) {
                message = "File content validation failed: " + err.issues.map((issue) => issue.path + ": " + issue.message );
            }
            console.log(message);
        }
        return emps;
    }
}

const fileService = new StoreEmployeesFileService();
export default fileService;
