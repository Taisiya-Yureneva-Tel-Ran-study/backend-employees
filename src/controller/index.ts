import express, { Request } from 'express';
import "dotenv/config";
import morgan from 'morgan';
import errorHandler from '../middleware/errorHandler.ts';
import { service } from '../service/EmployeeServiceMap.ts';
import { validateEmployee } from '../middleware/validation.ts';
import { EmployeeScheme, PartialEmployeeScheme } from '../middleware/schemes.ts';
import fileService from '../service/StoreEmployeesFileService.ts';
import accountingService from '../service/AccountingServiceMap.ts';
import { authenticate } from '../middleware/auth/authentication.ts';
import { authorize } from '../middleware/auth/authorization.ts';

// Fetching employees and setting the map
const emps = fileService.fetchEmployees();
service.setEmployeesMap(emps);

const PORT = process.env.PORT || 3500;

const app = express();
const server = app.listen(PORT, () => console.log('Server started on port ', PORT));

app.use(express.json());

app.use(morgan("dev"));

app.post("/login", (req, res) => {
    res.send(accountingService.login(req.body));
})

app.use(authenticate);

app.get("/employees", (req: Request & {user: string, role: string}, res) => {
    const re = service.getAll(req.query.department as string);
    res.statusCode = 200;
    res.json(re);
})

app.get("/employees/:id", (req, res) => {
    res.statusCode = 200;
    res.json(service.getEmployee(req.params.id));
})

app.use(authorize);

app.post("/employees", authenticate, validateEmployee(EmployeeScheme), (req, res) => {
    res.statusCode = 200;
    res.send(service.addEmployee(req.body));
})

app.delete("/employees/:id", (req, res) => {
    
    res.statusCode = 200;
    res.json(service.deleteEmployee(req.params.id));
});

app.patch("/employees/:id", validateEmployee(PartialEmployeeScheme), (req, res) => {
    const re = service.editEmployee(req.params.id, req.body);
    res.json(re);
})

app.use(errorHandler);

function shutdown() {
    fileService.saveEmployees(service.getAll());
    server.close(() => console.log('Server stopped'));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
