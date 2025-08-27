import { MongoMemoryServer } from "mongodb-memory-server";
import AbstractEmployeesServiceMongo from "./AbastractEmployeesServiceMongo.ts";
import { registerEmployeeService } from "./registry.ts";

const EMPLOYEES_DB_NAME = "employees_db";
const EMPLOYEES_COLLECTION = "employees";

class EmployeesServiceMongoInMemory extends AbstractEmployeesServiceMongo {
    constructor(uri: string, dbName: string, collectionName: string, 
        private mongoMemoryServer: MongoMemoryServer) {
        super(uri, dbName, collectionName);
    }
    async save(): Promise<void> {
        await super.save();
        this.mongoMemoryServer.stop();
        return Promise.resolve();
    }
}

registerEmployeeService("mongo-in-memory", async () => {
    const server = await MongoMemoryServer.create();
    const uri = server.getUri();
    const serviceInstance = new EmployeesServiceMongoInMemory(uri,
         EMPLOYEES_DB_NAME, EMPLOYEES_COLLECTION, server);
    await serviceInstance.init();
    return serviceInstance;     
})
