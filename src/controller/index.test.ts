import supertest from 'supertest';
import app from './index.ts';
import test from 'node:test';
import assert from 'assert/strict';

test("good", async () => {
    const res = await supertest(app).get("/employees").set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTUxMDg3NzgsImV4cCI6MTc1NTExMjM3OCwic3ViIjoiYWRtaW4ifQ.Jtc_63yA6aNUl8K-XkjxhiPqcU-w1QD6fnatb4Zz7jY");
    assert.equal(res.statusCode, 200);
    //.set("Authorization", "kuku").expect(401);
})

test("unauthorized", async () => {
    const res = await supertest(app).get("/employees");
    assert.equal(res.statusCode, 401);
})

