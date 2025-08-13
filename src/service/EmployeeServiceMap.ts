import { randomUUID } from "crypto";
import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";
import { EmployeeExistsError, EmployeeNotFoundError } from "../middleware/errorHandler.ts";
import { readFileSync, writeFileSync } from "fs";
import { EmployeeScheme } from "../middleware/validation/schemes.ts";

class EmployeeServiceMap implements EmployeeService {
    private employees: Map<string, Employee> = new Map();

    getAll(department?: string): Employee[] {
        if (department) return Array.from(this.employees.values()).filter(e => e.department === department);
        return Array.from(this.employees.values());
    }

    addEmployee(obj: Employee): Employee {
        if (!obj.id || obj.id.length < 1) obj.id = randomUUID();
        if (this.employees.has(obj.id))
            throw new EmployeeExistsError(obj.id);
        this.employees.set(obj.id, obj);
        return { ...this.employees.get(obj.id) };
    }

    getEmployee(id: string): Employee {
        return { ...this.employees.get(id) };
    }

    deleteEmployee(id: string): Employee {
        const res: Employee = this.employees.get(id);
        if (!res) throw new EmployeeNotFoundError(`Cannot remove employee: employee with id '${id}' not found`);
        this.employees.delete(id);
        return res;
    }

    editEmployee(id: string, obj: Partial<Employee>): Employee {
        console.log(obj);
        let emp = this.employees.get(id);
        if (!emp) throw new EmployeeNotFoundError(`Employee with '${id}' not found. Cannot update.`);

        let newEmp = { ...emp, ...obj };
        this.employees.set(id, newEmp);
        return { ...newEmp };
    }

    setEmployeesMap() {
        try {
            const res = readFileSync(process.env.empFileName || "employees.json", { "encoding": "utf-8" });
            const employees = JSON.parse(res);
            employees & employees.forEach((emp: Employee) => {
                if (EmployeeScheme.parse(emp)) this.addEmployee(emp);
            });
        } catch (e) {
            console.log("Could not fetch employees from file: ", e.message);
        }
    }

    save() {
        writeFileSync(process.env.empFileName || "employees.json", JSON.stringify(this.getAll()));
    }
}

const service = new EmployeeServiceMap();
service.setEmployeesMap();
export { service };