require("dotenv").config({
    path: ".env.test"
});
jest.setTimeout(30000);
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const connectDB = require("../src/config/db");


beforeAll(async () => {
    await connectDB();
});


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});


describe("GET /", () => {

    it("should return 200 OK", async () => {

        const res = await request(app).get("/");

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual({
            message: "AI Resume Gap Analyzer API is running"
        });

    });

});


describe("POST /api/auth/register", () => {

    it("should register a new user", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: `test${Date.now()}@gmail.com`,
                password: "12345678"
            });

        expect(res.statusCode).toBe(201);

        expect(res.body.message).toBe(
            "User registered successfully"
        );

        expect(res.body.user).toHaveProperty("id");
        expect(res.body.user.name).toBe("Test User");
        expect(res.body.user.email).toContain("@gmail.com");

    });


    it("should reject registration when required fields are missing", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "missing@gmail.com",
                password: "12345678"
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.message).toBe(
            "Name, email and password are required"
        );

    });


    it("should reject duplicate email", async () => {

        const email = `duplicate${Date.now()}@gmail.com`;

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "First User",
                email,
                password: "12345678"
            });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Second User",
                email,
                password: "12345678"
            });

        expect(res.statusCode).toBe(409);

        expect(res.body.message).toBe(
            "User already exists"
        );

    });

});


describe("POST /api/auth/login", () => {

    it("should login user with correct credentials", async () => {

        const email = `login${Date.now()}@gmail.com`;

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Login User",
                email,
                password: "12345678"
            });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "12345678"
            });

        expect(res.statusCode).toBe(200);

        expect(res.body.message).toBe("Login successful");

        expect(res.body.user.name).toBe("Login User");
        expect(res.body.user.email).toBe(email);

        expect(res.headers["set-cookie"]).toBeDefined();

        expect(
            res.headers["set-cookie"].some(cookie =>
                cookie.startsWith("token=")
            )
        ).toBe(true);

    });


    it("should reject login with wrong password", async () => {

        const email = `wrong${Date.now()}@gmail.com`;

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Wrong Password User",
                email,
                password: "12345678"
            });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(401);

        expect(res.body.message).toBe(
            "Invalid email or password"
        );

    });

});


describe("GET /api/auth/me", () => {

    it("should reject unauthenticated request", async () => {

        const res = await request(app)
            .get("/api/auth/me");

        expect(res.statusCode).toBe(401);

        expect(res.body.message).toBe(
            "Unauthorized. Please login."
        );

    });


    it("should return current user when authenticated", async () => {

        const agent = request.agent(app);

        const email = `me${Date.now()}@gmail.com`;

        await agent
            .post("/api/auth/register")
            .send({
                name: "Me Test User",
                email,
                password: "12345678"
            });

        const loginRes = await agent
            .post("/api/auth/login")
            .send({
                email,
                password: "12345678"
            });

        expect(loginRes.statusCode).toBe(200);

        const res = await agent
            .get("/api/auth/me");

        expect(res.statusCode).toBe(200);

        expect(res.body.user.name).toBe("Me Test User");
        expect(res.body.user.email).toBe(email);

        expect(res.body.user.password).toBeUndefined();

    });

});


describe("POST /api/auth/logout", () => {

    it("should logout authenticated user", async () => {

        const agent = request.agent(app);

        const email = `logout${Date.now()}@gmail.com`;

        await agent
            .post("/api/auth/register")
            .send({
                name: "Logout Test User",
                email,
                password: "12345678"
            });

        const loginRes = await agent
            .post("/api/auth/login")
            .send({
                email,
                password: "12345678"
            });

        expect(loginRes.statusCode).toBe(200);

        const meBeforeLogout = await agent
            .get("/api/auth/me");

        expect(meBeforeLogout.statusCode).toBe(200);

        const logoutRes = await agent
            .post("/api/auth/logout");

        expect(logoutRes.statusCode).toBe(200);

        expect(logoutRes.body.message).toBe(
            "Logout successful"
        );

        const meAfterLogout = await agent
            .get("/api/auth/me");

        expect(meAfterLogout.statusCode).toBe(401);

        expect(meAfterLogout.body.message).toBe(
            "Unauthorized. Please login."
        );

    });

});