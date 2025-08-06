import express from 'express';
import "dotenv/config";
import morgan from 'morgan';
import errorHandler from '../middleware/errorHandler.ts';
import EmployeeServiceMap from '../service/EmployeeServiceMap.ts';
import { validateEmployee } from '../middleware/validation.ts';

const PORT = process.env.PORT || 3500;

const app=express();
app.listen(PORT, () => console.log('Server started on port ', PORT));

let employees = new EmployeeServiceMap;

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    const re = employees.getAll();
    res.statusCode =  200;
    res.json(re);
})

app.post("/", validateEmployee, (req, res) => {
    res.statusCode = 200;
    res.send(employees.addEmployee(req.body));
})

app.get("/:id", (req, res) => {
    res.statusCode = 200;
    res.json(employees.getEmployee(req.params.id));
})

app.delete("/:id", (req, res) => {
    employees.deleteEmployee(req.params.id);
    res.statusCode = 200;
    res.send(`Employee with id '${req.params.id}' removed successfully`);
});

app.patch("/:id", (req, res) => {
    const re = employees.editEmployee(req.params.id, req.body);
    res.json(re);
})

app.use(errorHandler);