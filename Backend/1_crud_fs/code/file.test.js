const request = require("supertest");
const fs = require("fs");
const app = require("./app.js"); // Assuming the file name is "your-express-app-file.js"

jest.mock("fs"); // Mocking fs module

describe("GET /api/user", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return user data", async () => {
    // Mocking fs.readFileSync to return mock user data
    fs.readFileSync.mockReturnValueOnce(JSON.stringify([{ id: 1, name: "User1" }]));

    const response = await request(app).get("/api/user");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("successful");
    expect(response.body.message).toEqual([{ id: 1, name: "User1" }]);
    console.log("I passed");
  });

  it("should return 'no users found' message if userDataStore is empty", async () => {
    // Mocking fs.readFileSync to return empty array
    fs.readFileSync.mockReturnValueOnce(JSON.stringify([]));

    const response = await request(app).get("/api/user");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("successful");
    expect(response.body.message).toBe("no users found");
  });

  it("should handle file read error", async () => {
    // Mocking fs.readFileSync to throw an error
    fs.readFileSync.mockImplementationOnce(() => { throw new Error("File read error"); });

    const response = await request(app).get("/api/user");
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Internal server error");
  });
});

