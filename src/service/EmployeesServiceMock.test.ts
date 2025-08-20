import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";
import { registerEmployeeService } from "./registry.ts";

export default class EmployeesServiceMock implements EmployeeService {
    async save(): Promise<void> { }
    setEmployeesMap(): void { }

    async addEmployee(obj: Employee): Promise<Employee> {
        return {} as Employee;
    }
    async getEmployee(id: string): Promise<Employee> {
        return {} as Employee;
    }
    async deleteEmployee(id: string): Promise<Employee> {
        return {} as Employee;
    }
    async editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        return {} as Employee;

    }
    async getAll(): Promise<Employee[]> {
        return [{}] as Employee[];
    }

}

registerEmployeeService("mock", async (_) => new EmployeesServiceMock());