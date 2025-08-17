import express from 'express';
import morgan from 'morgan';
import errorHandler from '../../middleware/errorHandler.ts';
import accountingService from '../../service/AccountingServiceMap.ts';
import cors from 'cors';
import employeeRoutes from './employees-router.ts';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/employees", employeeRoutes);

app.post("/login", (req, res) => {
    res.json(accountingService.login(req.body));
})

app.use(errorHandler);

export default app;