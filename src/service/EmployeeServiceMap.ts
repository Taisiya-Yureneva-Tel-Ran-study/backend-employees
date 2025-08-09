import { randomUUID } from "crypto";
import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";
import { EmployeeExistsError, EmployeeNotFoundError } from "../middleware/errorHandler.ts";

class EmployeeServiceMap implements EmployeeService{
    getAll(department?: string): Employee[] {
        if (department) return Array.from(this.employees.values()).filter(e => e.department === department);
        return Array.from(this.employees.values());
    }

    addEmployee(obj: Employee): Employee {
        if (!obj.id || obj.id.length < 1) obj.id = randomUUID();
        if (this.employees.has(obj.id))
            throw new EmployeeExistsError(obj.id);
        this.employees.set(obj.id, obj);
        return this.employees.get(obj.id);
    }

    getEmployee(id: string): Employee {
        return this.employees.get(id);
    }

    deleteEmployee(id: string): boolean {
        const res = this.employees.delete(id);
        if (!res) throw new EmployeeNotFoundError(`Cannot remove employee: employee with id '${id}' not found`);
        return res;
    }

    editEmployee(id: string, obj: Partial<Employee>): Employee {
        console.log(obj);
        let emp = this.employees.get(id);
        if (!emp) throw new EmployeeNotFoundError(`Employee with '${id}' not found. Cannot update.`);

        let newEmp = { ...emp, ...obj };
        this.employees.set(id, newEmp);
        return {...newEmp};
    }

    private employees: Map<string, Employee> = new Map();
}

const service = new EmployeeServiceMap();
export { service };