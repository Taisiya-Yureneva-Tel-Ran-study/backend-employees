import { EmployeeExistsError, EmployeeNotFoundError } from "../middleware/errorHandler.ts";
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
                table.string('id').primary();
                table.string('fullName').notNullable();
                table.string('department').notNullable();
                table.string('avatar').notNullable().defaultTo('');
                table.integer('salary').notNullable();
                table.string('birthDate').notNullable();
            });
        }
    }

    async addEmployee(obj: Employee): Promise<Employee> {
        if (obj.id) {
            const res = await this.db.select('*').from(TABLE_NAME).where('id', obj.id);
            if (res.length > 0) {
                throw new EmployeeExistsError(obj.id);
            }
        }
        else {
            obj.id = crypto.randomUUID();
        }
        const res = await this.db.insert(obj).into(TABLE_NAME).returning('*');
        return res[0];
    }

    async getEmployee(id: string): Promise<Employee> {
        const res = await this.db.select('*').from(TABLE_NAME).where('id', id);
        return res[0] === undefined ? {} as Employee : res[0];
    }
    
    async deleteEmployee(id: string): Promise<Employee> {
        const emp = await this.db.select('*').from(TABLE_NAME).where('id', id);
        if (emp.length === 0) {
            throw new EmployeeNotFoundError(id);
        }
        await this.db.delete().from(TABLE_NAME).where('id', id).returning('*');
        return emp[0];
    }

    async editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        const emp = await this.db.select("*").from(TABLE_NAME).where('id', id);
        if (emp.length === 0) {
            throw new EmployeeNotFoundError(id);
        }
        const res = await this.db.update(obj).from(TABLE_NAME).where('id', id).returning('*');
        return res[0];
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
    async setEmployeesMap(): Promise<void> {
        await this.createTable();
    }
}