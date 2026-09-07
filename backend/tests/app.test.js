const request = require("supertest");
const app = require("../src/app");

describe("Banking API", () => {

    test("GET / should return banking service status", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

        expect(response.text)
            .toBe("Banking service is up and running");
    });

});