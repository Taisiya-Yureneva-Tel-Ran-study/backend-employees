import supertest from 'supertest';
import app from './routes/mainRoutes.ts';
import test from 'node:test';
import assert from 'assert/strict';
import { Employee } from '../model/Employee.ts';
import LoginData from '../model/LoginData.ts';

let adminToken: string; 
let userToken: string; 
let devToken: string;

const employeesPath = "/employees";
const loginPath = "/login";

const INVALID_DATA_CODE = 400;
const OK_CODE = 200;
const UNAUTHORIZED_CODE = 401;
const FORBIDDEN_CODE = 403;

const testEmployee1: Employee = {id: "testEmployee1", fullName: "Vasya Vasyliev", avatar: "https://example.com/avatar.png", birthDate:"1990-01-01", salary: 15000, department: "IT"};
const testEmployee2: Employee = {id: "testEmployee2", fullName: "Masha Semenova", avatar: "https://example.com/avatar1.png", birthDate:"1993-02-06", salary: 35000, department: "Accounting"};
const invalidEmployee: Employee = {id: "invalidEmployee", fullName: "Misha Smirnow", avatar: "https://example.com/avatar2.png", salary: 35000, department: "HR", birthDate: ""};

const testAdmin: LoginData = {email: "admin", password: "admin1"};
const testUser: LoginData = {email: "user", password: "user1"};
const testDev: LoginData = {email: "developer", password: "user1"};
const invalidUser: LoginData = {email: "vasya@example.com", password: "admin1"};

// Login tests
test("invalid loginData object", async() => {
    const res = await supertest(app).post(loginPath).send({username: "admin"});
    assert.equal(res.statusCode, INVALID_DATA_CODE);
})

test("invalid user", async() => {
    const res = await supertest(app).post(loginPath).send(invalidUser);
    assert.equal(res.statusCode, INVALID_DATA_CODE);
})

test("successful admin login", async() => {
    const res = await supertest(app).post(loginPath).send(testAdmin);
    adminToken = res.body.accessToken;
    assert.equal(res.statusCode, OK_CODE);
})

test("successful user login", async() => {
    const res = await supertest(app).post(loginPath).send(testUser);
    userToken = res.body.accessToken;
    assert.equal(res.statusCode, OK_CODE);
})

test("successful dev login", async() => {
    const res = await supertest(app).post(loginPath).send(testDev);
    devToken = res.body.accessToken;
    assert.equal(res.statusCode, OK_CODE);
})

// Employees tests
// Set employee
test("cannot set employee unauthorized", async () => {
    const res = await supertest(app).post(employeesPath).send(testEmployee1);
    assert.equal(res.statusCode, UNAUTHORIZED_CODE);
})

test("set employee with admin auth", async () => {
    const res = (await supertest(app).post(employeesPath).set("Authorization", "Bearer " + adminToken).send(testEmployee1));
    assert.equal(res.statusCode, OK_CODE);
})

test("cannot set invalid employee data with admin auth", async () => {
    const res = (await supertest(app).post(employeesPath).set("Authorization", "Bearer " + adminToken).send(invalidEmployee));
    assert.equal(res.statusCode, INVALID_DATA_CODE);
})

test("cannot set employee data with user auth", async () => {
    const res = (await supertest(app).post(employeesPath).set("Authorization", "Bearer " + userToken).send(testEmployee2));
    assert.equal(res.statusCode, FORBIDDEN_CODE);
})

// Test get employee by id
test("get employee data with user auth", async () => {
    const res = (await supertest(app).get(`${employeesPath}/${testEmployee1.id}`).set("Authorization", "Bearer " + userToken));
    assert.equal(res.statusCode, OK_CODE);
})

test("not get employee data with developer auth", async () => {
    const res = (await supertest(app).get(employeesPath).query({id: testEmployee1.id}).set("Authorization", "Bearer " + devToken));
    assert.equal(res.statusCode, FORBIDDEN_CODE);
})

test("not get employee data without any auth", async () => {
    const res = (await supertest(app).get(`${employeesPath}/${testEmployee1.id}`));
    assert.equal(res.statusCode, UNAUTHORIZED_CODE);
})

// Update employee
test("update employee data with admin auth", async () => {
    const res = (await supertest(app).patch(`${employeesPath}/${testEmployee1.id}`).set("Authorization", "Bearer " + adminToken).send({salary: 40000}));
    assert.equal(res.statusCode, OK_CODE);
})

test("cannot update employee data with user auth", async () => {
    const res = (await supertest(app).patch(`${employeesPath}/${testEmployee1.id}`).set("Authorization", "Bearer " + userToken).send({salary: 0}));
    assert.equal(res.statusCode, FORBIDDEN_CODE);
})

// Get all employees
test("get employees unauthorized", async () => {
    const res = await supertest(app).get(employeesPath);
    assert.equal(res.statusCode, UNAUTHORIZED_CODE);
})

test("get employees with user auth", async () => {
    const res = await supertest(app).get(employeesPath).set("Authorization", "Bearer " + userToken);
    assert.notEqual(res.body.length, 0);
    assert.equal(res.statusCode, OK_CODE);
})

test("get employees with admin auth", async () => {
    const res = await supertest(app).get(employeesPath).set("Authorization", "Bearer " + adminToken);
    assert.notEqual(res.body.length, 0);
    assert.equal(res.statusCode, OK_CODE);
})

test("cannot get employees with developer auth", async () => {
    const res = await supertest(app).get(employeesPath).set("Authorization", "Bearer " + devToken);
    assert.equal(res.statusCode, FORBIDDEN_CODE);
})

// Delete employee
test("cannot delete employees with user auth", async () => {
    const res = await supertest(app).delete(`${employeesPath}/${testEmployee1.id}`).set("Authorization", "Bearer " + userToken);
    assert.equal(res.statusCode, FORBIDDEN_CODE);
})

test("delete employee with admin auth", async () => {
    const res = await supertest(app).delete(`${employeesPath}/${testEmployee1.id}`).set("Authorization", "Bearer " + adminToken);
    assert.equal(res.statusCode, OK_CODE);
})

