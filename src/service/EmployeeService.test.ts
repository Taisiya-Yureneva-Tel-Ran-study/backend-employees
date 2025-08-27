import service from './bootstrap.ts';
import test, {beforeEach, after, before} from "node:test";
import assert from "node:assert/strict";
import { Employee } from '../model/Employee.ts';
import { EmployeeExistsError, EmployeeNotFoundError } from '../middleware/errorHandler.ts';

const stateEmployees: Employee[] = [
    {id: "1", fullName: 'Ivan', avatar: '', department: 'QA',salary: 10000, birthDate: "2001-11-12"},
    {id: "4", fullName: 'Ann', avatar: '', department: 'QA', salary: 10000, birthDate: "2001-11-12"},
    {id: "2", fullName: 'Vasiliy', avatar: '', department: 'IT', salary: 15000, birthDate: "1998-03-05"},
    {id: "3", fullName: 'Sidor', avatar: '', department: 'Accounting', salary: 20000, birthDate: "1978-02-11"}
]

const newGoodEmp: Employee = {fullName: 'Mary', avatar: '', department: 'QA', salary: 25000, birthDate: "2001-11-12"};
const invalidId = "100500";
const partialEmployee: Partial<Employee> = {salary: 30000};

before(async () => {await service.setEmployeesMap()});

after(async () => {await service.save()}) ;

beforeEach(async () => {
    const arr: Employee[] = await service.getAll();
    for (let i = 0; i < arr.length; i++) {
        await service.deleteEmployee(arr[i].id);
    }
    for (let emp of stateEmployees) {
        await service.addEmployee(emp);
    }
})

test("add existing employee", async () => {
    await assert.rejects(service.addEmployee(stateEmployees[0]), EmployeeExistsError);
})

test("adding a new employee returns correct data", async () => {
    const res = await service.addEmployee(newGoodEmp);
    assert.deepEqual(res, newGoodEmp);
})

test("get all employees", async () => {
    let arr: Employee[] = await service.getAll();
    arr.sort((a, b) => a.id.localeCompare(b.id))
    stateEmployees.sort((a, b) => a.id.localeCompare(b.id));
    assert.deepEqual(arr, stateEmployees);
})


test("get all from department", async () => {
    const arr: Employee[] = await service.getAll(stateEmployees[0].department);
    arr.sort((a, b) => a.id.localeCompare(b.id));
    stateEmployees.sort((a, b) => a.id.localeCompare(b.id));
    assert.deepEqual(arr, stateEmployees.filter(item => item.department === stateEmployees[0].department));
    assert.equal(arr.length, stateEmployees.filter(item => item.department === stateEmployees[0].department).length);
})

test("get all from invalid department - not found", async () => {
    const arr: Employee[] = await service.getAll("not found");
    assert.deepEqual(arr, []);
})

test("get employee by id", async () => {
    const emp: Employee = await service.getEmployee(stateEmployees[0].id);
    assert.deepEqual(emp, stateEmployees[0]);
})

test("get employee by id - not found", async () => {
    await assert.doesNotReject(service.getEmployee(invalidId));
})

test("delete employee", async () => {
    const res = await service.deleteEmployee(stateEmployees[0].id);
    assert.equal((await service.getAll()).length, stateEmployees.length - 1);
    assert.deepEqual(res, stateEmployees[0]);
})

test("delete employee - not found", async () => {
    await assert.rejects(service.deleteEmployee(invalidId), EmployeeNotFoundError);
})

test("update employee", async () => {
    const res = await service.editEmployee(stateEmployees[0].id, partialEmployee);
    assert.equal(res.salary, partialEmployee.salary);
    assert.equal((await service.getAll()).length, stateEmployees.length);
    const after = await service.getEmployee(stateEmployees[0].id);
    assert.equal(after.salary, partialEmployee.salary);
})

test("update employee - not found", async () => {
    await assert.rejects(service.editEmployee(invalidId, partialEmployee), EmployeeNotFoundError);
})
