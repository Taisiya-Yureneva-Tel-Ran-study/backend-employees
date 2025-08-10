import express from 'express';
import "dotenv/config";
import morgan from 'morgan';
import errorHandler from '../middleware/errorHandler.ts';
import { service } from '../service/EmployeeServiceMap.ts';
import { validateEmployee } from '../middleware/validation.ts';
import { EmployeeScheme, PartialEmployeeScheme } from '../middleware/schemes.ts';
import fileService from '../service/StoreEmployeesFileService.ts';

// Fetching employees and setting the map
const emps = fileService.fetchEmployees();
service.setEmployeesMap(emps);

const PORT = process.env.PORT || 3500;

const app = express();
const server = app.listen(PORT, () => console.log('Server started on port ', PORT));

app.use(express.json());

app.use(morgan("dev"));

app.get("/employees", (req, res) => {
    const re = service.getAll(req.query.department as string);
    res.statusCode = 200;
    res.json(re);
})

app.post("/employees", validateEmployee(EmployeeScheme), (req, res) => {
    res.statusCode = 200;
    res.send(service.addEmployee(req.body));
})

app.get("/employees/:id", (req, res) => {
    res.statusCode = 200;
    res.json(service.getEmployee(req.params.id));
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
