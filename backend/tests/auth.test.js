const request = require("supertest");
const app = require("../src/app");

const userModel = require("../src/models/user.model");

describe("Authentication API", () => {

    describe("POST /api/auth/register", () => {

        test("should register a new user", async () => {

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123"
                });

            expect(response.statusCode).toBe(201);

            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");

            expect(response.body.user.name)
                .toBe("Test User");

            expect(response.body.user.email)
                .toBe("test@example.com");
        });

        test("should reject registration with an existing email", async () => {

            // First registration
            await request(app)
                .post("/api/auth/register")
                .send({
                    name: "First User",
                    email: "duplicate@example.com",
                    password: "password123"
                });

            // Second registration with the same email
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Second User",
                    email: "duplicate@example.com",
                    password: "password456"
                });

            expect(response.statusCode).toBe(402);

            expect(response.body.message)
                .toBe("User already exists with email");

            expect(response.body.status)
                .toBe("failed");
        });

        test("should reject registration when email is missing", async () => {

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Test User",
                    password: "password123"
                });

            expect(response.statusCode).toBe(400);
        });

        test("should hash the user's password before storing", async () => {

            const password = "password123";

            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Hash Test User",
                    email: "hash@example.com",
                    password: password
                });

            expect(response.statusCode).toBe(201);

            const user = await userModel.findOne({
                email: "hash@example.com"
            });

            expect(user).not.toBeNull();

            expect(user.password).not.toBe(password);
        });

    });

});

