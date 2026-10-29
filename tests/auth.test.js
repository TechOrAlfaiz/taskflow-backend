const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-only-secret-not-for-real-use";

test("GET /api/tasks rejects requests without a token", async () => {
    const response = await request(app).get("/api/tasks");

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Authentication required");
});

test("GET /api/tasks rejects an invalid token", async ()=> {
    const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer invalid-token");

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Invalid or expired token");
});

test("GET /api/tasks rejects an expired token", async () => {
    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: "507f1f77bcf86cd799439011",
            algorithm: "HS256",
            expiresIn: -1
        }
    );

    const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Invalid or expired token");
});

test("GET /api/tasks rejects a token signed with another secret", async () => {
    const token = jwt.sign(
        {},
        "different-test-secret",
        {
            subject: "507f1f77bcf86cd799439011",
            algorithm: "HS256",
            expiresIn: "5m"
        }
    );

    const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Invalid or expired token");
});

test("GET /api/auth/check accepts a valid token", async () => {
    const userId = "507f1f77bcf86cd799439011";

    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: userId,
            algorithm: "HS256",
            expiresIn: "5m"
        }
    );

    const response = await request(app)
        .get("/api/auth/check")
        .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.message, "Authentication successful");
    assert.equal(response.body.userId, userId);
});

test("POST /api/auth/login rejects malformed JSON", async () => {
    const response = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send('{"email":"practice@example.com",}');

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "Invalid JSON body");
});

test("POST /api/tasks rejects a title longer than 200 characters", async () => {
    const token = jwt.sign(
        {},
        process.env.JWT_SECRET,
        {
            subject: "507f1f77bcf86cd799439011",
            algorithm: "HS256",
            expiresIn: "5m"
        }
    );

    const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "a".repeat(201) });

    assert.equal(response.status, 400);
    assert.equal(
        response.body.message,
        "Title must not exceed 200 characters"
    );
});

test("POST /api/auth/login rejects an oversized body", async () => {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "practice@example.com",
            password: "a".repeat(11 * 1024)
        });

    assert.equal(response.status, 413);
    assert.equal(response.body.message, "Request body is too large");
});