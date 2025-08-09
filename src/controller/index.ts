import express from 'express';
import "dotenv/config";
import morgan from 'morgan';
import errorHandler from '../middleware/errorHandler.ts';
import {service} from '../service/EmployeeServiceMap.ts';
import { validateEmployee } from '../middleware/validation.ts';
import { EmployeeScheme } from '../middleware/schemes.ts';

const PORT = process.env.PORT || 3500;

const app=express();
const server = app.listen(PORT, () => console.log('Server started on port ', PORT));

app.use(express.json());

app.use(morgan("dev"));

app.get("/employees", (req, res) => {
    const re = service.getAll(req.query.department as string);
    res.statusCode =  200;
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
    service.deleteEmployee(req.params.id);
    res.statusCode = 200;
    res.send(`Employee with id '${req.params.id}' removed successfully`);
});

app.patch("/employees/:id", (req, res) => {
    const re = service.editEmployee(req.params.id, req.body);
    res.json(re);
})

app.use(errorHandler);

function shutdown() {
    server.close(() => console.log('Server stopped'));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
