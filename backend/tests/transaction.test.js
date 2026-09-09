const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../src/app");

const userModel = require("../src/models/user.model");
const accountModel = require("../src/models/account.model");
const ledgerModel = require("../src/models/ledger.model");
const transactionModel = require("../src/models/transaction.model");

describe("Transaction Model", () => {

    test("should require all mandatory fields", async () => {

        const transaction = new transactionModel({});

        await expect(transaction.validate()).rejects.toThrow();
    });


    test("should reject a negative transaction amount", async () => {

        const transaction = new transactionModel({
            fromAccount: new mongoose.Types.ObjectId(),
            toAccount: new mongoose.Types.ObjectId(),
            amount: -100,
            idempotencyKey: "negative-test-key"
        });

        await expect(transaction.validate()).rejects.toThrow(
            "Transaction amount can't be negative"
        );
    });


    test("should reject a transaction without an idempotency key", async () => {

        const transaction = new transactionModel({
            fromAccount: new mongoose.Types.ObjectId(),
            toAccount: new mongoose.Types.ObjectId(),
            amount: 100
        });

        await expect(transaction.validate()).rejects.toThrow(
            "Idempotency key is required to perform a transaction"
        );
    });


    test("should default transaction status to PENDING", () => {

        const transaction = new transactionModel({
            fromAccount: new mongoose.Types.ObjectId(),
            toAccount: new mongoose.Types.ObjectId(),
            amount: 100,
            idempotencyKey: "pending-test-key"
        });

        expect(transaction.status).toBe("PENDING");
    });

});

describe("Initial Funds", () => {

    test("should allow a system user to provide initial funds", async () => {

        // Create system user
        const systemUser = await userModel.create({
            name: "System User",
            email: "system@test.com",
            password: "password123",
            systemUser: true
        });

        // Create system user's account
        const systemAccount = await accountModel.create({
            user: systemUser._id
        });

        // Create normal user
        const normalUser = await userModel.create({
            name: "Normal User",
            email: "normal@test.com",
            password: "password123"
        });

        // Create normal user's account
        const normalAccount = await accountModel.create({
            user: normalUser._id
        });

        // Login system user
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "system@test.com",
                password: "password123"
            });

        const token = loginResponse.body.token;

        // Provide initial funds
        const response = await request(app)
            .post("/api/transaction/system/initial-funds")
            .set("Authorization", `Bearer ${token}`)
            .send({
                toAccount: normalAccount._id.toString(),
                amount: 10000,
                idempotencyKey: "initial-funds-test-001"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body)
            .toHaveProperty("transaction");

        expect(response.body.transaction.status)
            .toBe("COMPLETED");

        // Login as the normal user
        const normalLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "normal@test.com",
                password: "password123"
            });

        const normalToken = normalLoginResponse.body.token;

        // Check customer's balance
        const balanceResponse = await request(app)
            .get(`/api/accounts/balance/${normalAccount._id}`)
            .set("Authorization", `Bearer ${normalToken}`);

        expect(balanceResponse.statusCode).toBe(200);

        expect(balanceResponse.body.balance).toBe(10000);


        expect(balanceResponse.statusCode).toBe(200);

        expect(balanceResponse.body.balance).toBe(10000);
    });

});

describe("Account to Account Transaction", () => {

    test("should successfully transfer money between two user accounts", async () => {


        const systemUser = await userModel.create({
            name: "System User",
            email: "system-transfer@test.com",
            password: "password123",
            systemUser: true
        });

        const systemAccount = await accountModel.create({
            user: systemUser._id
        });



        const sender = await userModel.create({
            name: "Sender User",
            email: "sender@test.com",
            password: "password123"
        });

        const senderAccount = await accountModel.create({
            user: sender._id
        });


        const receiver = await userModel.create({
            name: "Receiver User",
            email: "receiver@test.com",
            password: "password123"
        });

        const receiverAccount = await accountModel.create({
            user: receiver._id
        });

        const systemLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "system-transfer@test.com",
                password: "password123"
            });

        const systemToken = systemLoginResponse.body.token;


        const initialFundsResponse = await request(app)
            .post("/api/transaction/system/initial-funds")
            .set("Authorization", `Bearer ${systemToken}`)
            .send({
                toAccount: senderAccount._id.toString(),
                amount: 10000,
                idempotencyKey: "transfer-initial-funds-001"
            });

        expect(initialFundsResponse.statusCode).toBe(201);


        const senderLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "sender@test.com",
                password: "password123"
            });

        const senderToken = senderLoginResponse.body.token;



        const transactionResponse = await request(app)
            .post("/api/transaction/")
            .set("Authorization", `Bearer ${senderToken}`)
            .send({
                fromAccount: senderAccount._id.toString(),
                toAccount: receiverAccount._id.toString(),
                amount: 2000,
                idempotencyKey: "transfer-test-001"
            });

        expect(transactionResponse.statusCode).toBe(201);

        expect(transactionResponse.body)
            .toHaveProperty("transaction");

        expect(transactionResponse.body.transaction.status)
            .toBe("COMPLETED");



        const ledgerEntries = await ledgerModel.find({
            transaction: transactionResponse.body.transaction._id
        });

        // Exactly two entries must exist
        expect(ledgerEntries).toHaveLength(2);

        const debitEntry = ledgerEntries.find(
            entry => entry.type === "DEBIT"
        );

        const creditEntry = ledgerEntries.find(
            entry => entry.type === "CREDIT"
        );

        expect(debitEntry).toBeDefined();
        expect(creditEntry).toBeDefined();


        // Debit must belong to sender
        expect(debitEntry.account.toString())
            .toBe(senderAccount._id.toString());

        // Credit must belong to receiver
        expect(creditEntry.account.toString())
            .toBe(receiverAccount._id.toString());


        // Both ledger entries must contain ₹2,000
        expect(debitEntry.amount).toBe(2000);
        expect(creditEntry.amount).toBe(2000);


        const senderBalanceResponse = await request(app)
            .get(`/api/accounts/balance/${senderAccount._id}`)
            .set("Authorization", `Bearer ${senderToken}`);

        expect(senderBalanceResponse.statusCode).toBe(200);

        expect(senderBalanceResponse.body.balance).toBe(8000);


        const receiverLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "receiver@test.com",
                password: "password123"
            });

        const receiverToken = receiverLoginResponse.body.token;

        const receiverBalanceResponse = await request(app)
            .get(`/api/accounts/balance/${receiverAccount._id}`)
            .set("Authorization", `Bearer ${receiverToken}`);

        expect(receiverBalanceResponse.statusCode).toBe(200);

        expect(receiverBalanceResponse.body.balance).toBe(2000);
    });

});