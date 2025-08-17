import { Employee } from "../model/Employee";
import EmployeeService from "./EmployeeService";

export default class EmployeesServiceMock implements EmployeeService {
    private employeesMap: Map<string, Employee> = new Map();
    save(): void {

    }
    setEmployeesMap(): void {

    }

    addEmployee(obj: Employee): Employee {
        this.employeesMap.set(obj.id, obj);
        return {...this.employeesMap.get(obj.id) };
    }
    getEmployee(id: string): Employee {
        return { ...this.employeesMap.get(id) };
    }
    deleteEmployee(id: string): Employee {
        const employee = this.employeesMap.get(id);
        this.employeesMap.delete(id);
        return employee;
    }
    editEmployee(id: string, obj: Partial<Employee>): Employee {
        let emp = this.employeesMap.get(id);

        let newEmp = { ...emp, ...obj };
        this.employeesMap.set(id, newEmp);
        return { ...newEmp };

    }
    getAll(): Employee[] {
        return [{}] as Employee[];
    }

}