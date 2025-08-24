import AbstractEmployeeServiceSql from "./AbstractEmployeeServiceSql.ts";
import {Knex} from "knex";
import { registerEmployeeService } from "./registry.ts";

class EmployeeServiceSqlite extends AbstractEmployeeServiceSql {
    constructor(config: Knex.Config) {
        super(config);
    }
}

registerEmployeeService("sqlite", async (_) => new EmployeeServiceSqlite({
    client: "sqlite3",
    connection: {
        filename: process.env.SQLITE_FILE_NAME || "employees.sqlite"
    },
    useNullAsDefault: true
}));