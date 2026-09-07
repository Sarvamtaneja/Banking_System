require("dotenv").config();
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");

jest.mock("../src/services/email.service", () => ({
    sendRegistrationEmail: jest.fn().mockResolvedValue(true),
    sendLoginEmail: jest.fn().mockResolvedValue(true),
    sendTransactionEmail: jest.fn().mockResolvedValue(true)
}));

let mongoServer;

beforeAll(async () => {

    mongoServer = await MongoMemoryReplSet.create({
        replSet: {
            count: 1
        }
    });

    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterEach(async () => {

    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    await mongoServer.stop();
});