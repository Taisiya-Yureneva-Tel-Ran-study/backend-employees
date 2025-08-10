import { Employee } from "../model/Employee";

export default interface EmployeeService {
    addEmployee(obj: Employee): Employee;
    getEmployee(id: string): Employee;
    deleteEmployee(id: string): Employee;
    editEmployee(id: string, obj: Partial<Employee>): Employee;
    getAll(): Employee[];
}