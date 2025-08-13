import StoreEmployeesService from "./StoreEmployeesService.ts";
import { Employee } from "../model/Employee.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { EmployeeScheme } from "../middleware/schemes.ts";
import { ZodError } from "zod";

class StoreEmployeesFileService implements StoreEmployeesService {
    private filename: string = process.env.empFileName || "employees.json";

    fetchEmployees(): Employee[] {
        let emps = new Array<Employee>;
        try {
            const res = readFileSync(this.filename, { "encoding": "utf-8" });
            emps = JSON.parse(res).map((emp: Employee) => {
                return EmployeeScheme.parse(emp);
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

    saveEmployees(employees: Employee[]): void {
        writeFileSync(this.filename, JSON.stringify(employees));
    }
}

const fileService = new StoreEmployeesFileService();
export default fileService;
