import EmployeeService from './EmployeeService.ts';
import { Employee } from '../model/Employee.ts';
import { Collection, Db, MongoClient } from 'mongodb';
import { EmployeeExistsError, EmployeeNotFoundError } from '../middleware/errorHandler.ts';

export default abstract class AbastractEmployeesServiceMongo implements EmployeeService {
    client: MongoClient;
    db: Db;
    collection: Collection<Employee>;

    constructor(uri: string, private dbName: string, private collectionName: string) {
        this.client = new MongoClient(uri);
    };

    async init(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        this.collection.createIndex({id: 1}, {unique: true});
        this.collection.createIndex({department: "hashed"});
    }

    async addEmployee(obj: Employee): Promise<Employee>{
        try {
            return await this.collection.insertOne(obj).then(() => this.collection.findOne({id: obj.id}));
        } catch (e) {
            throw new EmployeeExistsError(obj.id);
        }
    };

    async getEmployee(id: string): Promise<Employee>{
        return await this.collection.findOne({id});
    };

    async deleteEmployee(id: string): Promise<Employee>{
        const obj = await this.collection.findOneAndDelete({id});
        if (!obj) throw new EmployeeNotFoundError(id);
        return obj;
    };

    async editEmployee(id: string, obj: Partial<Employee>): Promise<Employee> {
        const res = await this.collection.updateOne({id}, {$set: obj}).then(() => this.collection.findOne({id}));
        if (!res) throw new EmployeeNotFoundError(id);
        return res;
    };

    async getAll(department?: string): Promise<Employee[]> {
        const filter = department ? {department} : {};
        return await this.collection.find(filter).toArray();
    };

    async save(): Promise<void> {
        await this.client.close();
    };

    setEmployeesMap(): void {
        this.init()
    };
}