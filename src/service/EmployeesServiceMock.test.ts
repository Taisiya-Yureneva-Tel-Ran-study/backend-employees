import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";

export default class EmployeesServiceMock implements EmployeeService {
    save(): void {
        
    }
    setEmployeesMap(): void {
        
    }
    addEmployee(obj: Employee): Employee {
        return {} as Employee;
    }
    getEmployee(id: string): Employee {
        return {} as Employee;
    }
    deleteEmployee(id: string): Employee {
        return {} as Employee;
    }
    editEmployee(id: string, obj: Partial<Employee>): Employee {
        return {} as Employee;
    }
    getAll(): Employee[] {
        return [{}] as Employee[];
    }
    
}