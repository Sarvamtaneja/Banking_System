const request = require("supertest");
const app = require("../src/app");

describe("Account API", () => {

    describe("POST /api/accounts/create", () => {

        test("should create an account for an authenticated user", async () => {

            // Creating a user
            const registerResponse = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Account Test User",
                    email: "account@example.com",
                    password: "password123"
                });

            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "account@example.com",
                    password: "password123"
                });

            const token = loginResponse.body.token;

            // Creating an account
            const response = await request(app)
                .post("/api/accounts/create")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(201);

            expect(response.body).toHaveProperty("account");

            expect(response.body.account).toHaveProperty("user");

            expect(response.body.account.user)
                .toBe(registerResponse.body.user._id);
        });

        test("should reject account creation without authentication", async () => {

            const response = await request(app)
                .post("/api/accounts/create");

            expect(response.statusCode).toBe(401);
        });

    });

    describe("GET /api/accounts", () => {

        test("should return accounts belonging to the authenticated user", async () => {

            // Registering a user
            await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Accounts Test User",
                    email: "accounts@example.com",
                    password: "password123"
                });

            // Login
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "accounts@example.com",
                    password: "password123"
                });

            const token = loginResponse.body.token;

            // Creating an account
            await request(app)
                .post("/api/accounts/create")
                .set("Authorization", `Bearer ${token}`);

            // Get accounts
            const response = await request(app)
                .get("/api/accounts")
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toHaveProperty("accounts");

            expect(response.body.accounts).toHaveLength(1);

            expect(response.body.accounts[0].user)
                .toBe(loginResponse.body.user._id);
        });

    });

    describe("GET /api/accounts/balance/:accountId", () => {

        test("should return zero balance for a newly created account", async () => {

            // Register user
            await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Balance Test User",
                    email: "balance@example.com",
                    password: "password123"
                });

            // Login
            const loginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "balance@example.com",
                    password: "password123"
                });

            const token = loginResponse.body.token;

            // Create account
            const accountResponse = await request(app)
                .post("/api/accounts/create")
                .set("Authorization", `Bearer ${token}`);

            const accountId = accountResponse.body.account._id;

            // Get balance
            const response = await request(app)
                .get(`/api/accounts/balance/${accountId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body.accountId)
                .toBe(accountId);

            expect(response.body.balance)
                .toBe(0);
        });

        test("should not allow a user to access another user's account", async () => {

            // Create User A
            await request(app)
                .post("/api/auth/register")
                .send({
                    name: "User A",
                    email: "usera@example.com",
                    password: "password123"
                });

            const userALogin = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "usera@example.com",
                    password: "password123"
                });

            const tokenA = userALogin.body.token;

            // Create User A's account
            const accountAResponse = await request(app)
                .post("/api/accounts/create")
                .set("Authorization", `Bearer ${tokenA}`);

            const accountAId = accountAResponse.body.account._id;


            // Create User B
            await request(app)
                .post("/api/auth/register")
                .send({
                    name: "User B",
                    email: "userb@example.com",
                    password: "password123"
                });

            const userBLogin = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "userb@example.com",
                    password: "password123"
                });

            const tokenB = userBLogin.body.token;


            // User B tries to access User A's account
            const response = await request(app)
                .get(`/api/accounts/balance/${accountAId}`)
                .set("Authorization", `Bearer ${tokenB}`);


            expect(response.statusCode).toBe(404);

            expect(response.body.message)
                .toBe("Account not found");
        });

    });

});