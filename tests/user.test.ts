import { describe, expect, it, beforeEach } from "bun:test";
import { app } from "../src/index";
import { db } from "../src/db";
import { users, sessions } from "../src/db/schema";

describe("User API", () => {
    // Cleanup database before each test
    beforeEach(async () => {
        await db.delete(sessions);
        await db.delete(users);
    });

    describe("POST /api/users", () => {
        it("should successfully register a new user", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Test User",
                        email: "test@example.com",
                        password: "password123"
                    })
                })
            );

            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body.message).toBe("User created successfully");
        });

        it("should fail if email already exists", async () => {
            // Register first user
            await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "User 1",
                        email: "duplicate@example.com",
                        password: "password123"
                    })
                })
            );

            // Try to register again with same email
            const response = await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "User 2",
                        email: "duplicate@example.com",
                        password: "password123"
                    })
                })
            );

            expect(response.status).toBe(400);
            const body = await response.json();
            expect(body.error).toBe("Email sudah terdaftar");
        });

        it("should fail if required fields are missing", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Test User"
                        // email and password missing
                    })
                })
            );

            expect(response.status).toBe(422);
        });

        it("should fail if input exceeds max length", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "a".repeat(256), // Limit is 255
                        email: "test@example.com",
                        password: "password123"
                    })
                })
            );

            expect(response.status).toBe(422);
        });
    });

    describe("POST /api/users/login", () => {
        beforeEach(async () => {
            // Register a user for login tests
            await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Login User",
                        email: "login@example.com",
                        password: "password123"
                    })
                })
            );
        });

        it("should login successfully and return a token", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "login@example.com",
                        password: "password123"
                    })
                })
            );

            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body.data).toBeDefined();
        });

        it("should fail with wrong password", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "login@example.com",
                        password: "wrongpassword"
                    })
                })
            );

            expect(response.status).toBe(401);
            const body = await response.json();
            expect(body.error).toBe("Email atau password salah");
        });

        it("should fail with non-existent email", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "notfound@example.com",
                        password: "password123"
                    })
                })
            );

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/users/current", () => {
        let token: string;

        beforeEach(async () => {
            // Register and login to get a token
            await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Current User",
                        email: "current@example.com",
                        password: "password123"
                    })
                })
            );

            const loginRes = await app.handle(
                new Request("http://localhost/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "current@example.com",
                        password: "password123"
                    })
                })
            );
            const loginBody = await loginRes.json();
            token = loginBody.data;
        });

        it("should return current user data with valid token", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/current", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );

            expect(response.status).toBe(200);
            const body = await response.json();
            expect(body.data.email).toBe("current@example.com");
        });

        it("should fail without authorization header", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/current", {
                    method: "GET"
                })
            );

            expect(response.status).toBe(401);
        });

        it("should fail with invalid token", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/current", {
                    method: "GET",
                    headers: { "Authorization": "Bearer invalid-token" }
                })
            );

            expect(response.status).toBe(401);
        });
    });

    describe("DELETE /api/users/logout", () => {
        let token: string;

        beforeEach(async () => {
            await app.handle(
                new Request("http://localhost/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Logout User",
                        email: "logout@example.com",
                        password: "password123"
                    })
                })
            );

            const loginRes = await app.handle(
                new Request("http://localhost/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: "logout@example.com",
                        password: "password123"
                    })
                })
            );
            const loginBody = await loginRes.json();
            token = loginBody.data;
        });

        it("should logout successfully and invalidate token", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/logout", {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );

            expect(response.status).toBe(200);
            expect((await response.json()).data).toBe("OK");

            // Verify token is invalidated
            const currentRes = await app.handle(
                new Request("http://localhost/api/users/current", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                })
            );
            expect(currentRes.status).toBe(401);
        });

        it("should fail logout without authorization header", async () => {
            const response = await app.handle(
                new Request("http://localhost/api/users/logout", {
                    method: "DELETE"
                })
            );

            expect(response.status).toBe(401);
        });
    });
});
