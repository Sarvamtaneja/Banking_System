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

describe("POST /api/auth/login", () => {

    test("should login with valid credentials", async () => {

        // Creating a user first
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Login Test User",
                email: "login@example.com",
                password: "password123"
            });

        // Trying to login
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "login@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("token");

        expect(response.body.user.email)
            .toBe("login@example.com");

        expect(response.body.user.name)
            .toBe("Login Test User");

        expect(response.body.token)
            .toBeDefined();
    });

    test("should reject login with incorrect password", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Wrong Password User",
                email: "wrongpassword@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "wrongpassword@example.com",
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("email or password is INVALID");
    });

    test("should reject login when user does not exist", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "doesnotexist@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("email or password is INVALID");
    });

    test("should reject login when email is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "password123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("email or password is INVALID");
    });

    test("should reject login when password is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "login@example.com"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("email or password is INVALID");
    });

});

