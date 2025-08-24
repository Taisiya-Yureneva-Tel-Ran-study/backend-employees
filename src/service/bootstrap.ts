import "./EmployeeServiceMap.ts"
import "./EmployeesServiceMock.test.ts"
import "./EmployeeServiceSqlite.ts"
import { createEmployeeService } from "./registry.ts";

const key: string = process.argv[2] ? process.argv[2] : "mock";
const service = await createEmployeeService(key);

export default service;