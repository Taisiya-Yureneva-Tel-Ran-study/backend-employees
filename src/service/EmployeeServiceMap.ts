import { randomUUID } from "crypto";
import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";
import { EmployeeExistsError, EmployeeNotFoundError } from "../middleware/errorHandler.ts";
import { readFileSync, writeFileSync } from "fs";
import { EmployeeScheme } from "../middleware/validation/schemes.ts";
import EmployeesServiceMock from "./EmployeesServiceMock.test.ts";

class EmployeeServiceMap implements EmployeeService {
    private employees: Map<string, Employee> = new Map();

    async getAll(department?: string): Promise<Employee[]> {
        if (department) return Array.from(this.employees.values()).filter(e => e.department === department);
        return Array.from(this.employees.values());
    }

    async addEmployee(obj: Employee): Promise<Employee> {
        if (!obj.id || obj.id.length < 1) obj.id = randomUUID();
        if (this.employees.has(obj.id))
            throw new EmployeeExistsError(obj.id);
        this.employees.set(obj.id, obj);
        return { ...this.employees.get(obj.id) };
    }

    async getEmployee(id: string): Promise<Employee> {
        return { ...this.employees.get(id) };
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const res: Employee = this.employees.get(id);
        if (!res) throw new EmployeeNotFoundError(`Cannot remove employee: employee with id '${id}' not found`);
        this.employees.delete(id);
        return res;
    }

    async editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        let emp = await this.employees.get(id);
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

    async save(): Promise<void> {
        writeFileSync(process.env.empFileName || "employees.json", JSON.stringify(await this.getAll()));
    }
}

const service =  new EmployeeServiceMap();
service.setEmployeesMap();
export { service };