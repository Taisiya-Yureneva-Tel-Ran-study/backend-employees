import { Employee } from "../model/Employee";

export default interface StoreEmployeesService {
    fetchEmployees(path: string): Employee[];
}