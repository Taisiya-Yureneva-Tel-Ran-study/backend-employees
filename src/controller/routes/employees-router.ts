import express, {Request} from "express";
import { EmployeeScheme, PartialEmployeeScheme } from "../../middleware/validation/schemes.ts";
import { validateEmployee } from "../../middleware/validation/validation.ts";
import { service } from "../../service/EmployeeServiceMap.ts";
import { authorize } from "../../middleware/auth/authorization.ts";
import { authenticate } from "../../middleware/auth/authentication.ts";

const employeeRoutes = express.Router();

employeeRoutes.use(authenticate);

employeeRoutes.get("/", authorize(["ADMIN", "USER"]), (req: Request, res) => {
    const re = service.getAll(req.query.department as string);
    res.statusCode = 200;
    res.json(re);
})

employeeRoutes.get("/:id", authorize(["ADMIN", "USER"]), (req, res) => {
    res.statusCode = 200;
    res.json(service.getEmployee(req.params.id));
})

employeeRoutes.post("/", authorize(["ADMIN"]), validateEmployee(EmployeeScheme), (req, res) => {
    res.statusCode = 200;
    res.send(service.addEmployee(req.body));
})

employeeRoutes.delete("/:id", authorize(["ADMIN"]), (req, res) => {
    
    res.statusCode = 200;
    res.json(service.deleteEmployee(req.params.id));
});

employeeRoutes.patch("/:id", authorize(["ADMIN"]), validateEmployee(PartialEmployeeScheme), (req, res) => {
    const re = service.editEmployee(req.params.id, req.body);
    res.json(re);
})

export default employeeRoutes;
