import { Employee } from "../model/Employee.ts";
import EmployeeService from "./EmployeeService.ts";
import knex, {Knex} from 'knex';

const TABLE_NAME = 'employees';

export default abstract class AbstractEmployeesServiceSql implements EmployeeService {
    private db: Knex;

    constructor(config: Knex.Config) {
        this.db = knex(config);
    }

    async createTable(): Promise<void> {
        const exists = await this.db.schema.hasTable(TABLE_NAME);
        if (!exists) {
            await this.db.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.string('fullName').notNullable();
                table.string('department').notNullable();
                table.string('avatar').notNullable().defaultTo('');
                table.integer('salary').notNullable();
                table.string('birthDate').notNullable();
            });
        }
    }

    addEmployee(obj: Employee): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    getEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    deleteEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    async getAll(department?: string): Promise<Employee[]> {
        const query = this.db<Employee>(TABLE_NAME);
        if (department) {
            query.where('department', department);
        }
        return await query;
    }
    async save(): Promise<void> {
        await this.db.destroy();
    }
    setEmployeesMap(): void {
        throw new Error("Method not implemented.");
    }
}