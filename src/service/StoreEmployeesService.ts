import { Employee } from "../model/Employee";

export default interface StoreEmployeesService {
    fetchEmployees(): Employee[];
    saveEmployees(employees: Employee[]): void;
}