import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";

export default class EmployeesServiceMock implements EmployeeService {
    private employeesMap: Map<string, Employee> = new Map();
    async save(): Promise<void> {

    }
    setEmployeesMap(): void {

    }

    async addEmployee(obj: Employee): Promise<Employee> {
        this.employeesMap.set(obj.id, obj);
        return {...this.employeesMap.get(obj.id) };
    }
    async getEmployee(id: string): Promise<Employee> {
        return { ...this.employeesMap.get(id) };
    }
    async deleteEmployee(id: string): Promise<Employee> {
        const employee = this.employeesMap.get(id);
        this.employeesMap.delete(id);
        return employee;
    }
    async editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        let emp = this.employeesMap.get(id);

        let newEmp = { ...emp, ...obj };
        this.employeesMap.set(id, newEmp);
        return { ...newEmp };

    }
    async getAll(): Promise<Employee[]> {
        return [{}] as Employee[];
    }

}