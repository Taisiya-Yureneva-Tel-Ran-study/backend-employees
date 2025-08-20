import { Employee } from "../model/Employee";

export default interface EmployeeService {
    addEmployee(obj: Employee): Promise<Employee>;
    getEmployee(id: string): Promise<Employee>;
    deleteEmployee(id: string): Promise<Employee>;
    editEmployee(id: string, obj: Partial<Employee>): Promise<Employee>;
    getAll(department?: string): Promise<Employee[]>;
    save(): Promise<void>;
    setEmployeesMap(): void;
}