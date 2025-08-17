import express from 'express';
import "dotenv/config";
import morgan from 'morgan';
import errorHandler from '../middleware/errorHandler.ts';
import { service } from '../service/EmployeeServiceMap.ts';
import accountingService from '../service/AccountingServiceMap.ts';
import cors from 'cors';
import employeeRoutes from './routes/employees-router.ts';

const PORT = process.env.PORT || 3500;

const app = express();
const server = app.listen(PORT, () => console.log('Server started on port ', PORT));

app.use(express.json());
app.use(cors());
app.use("/employees", employeeRoutes);

app.use(morgan("dev"));


app.post("/login", (req, res) => {
    res.json(accountingService.login(req.body));
})

app.use(errorHandler);

function shutdown() {
    service.save();
    server.close(() => console.log('Server stopped'));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;