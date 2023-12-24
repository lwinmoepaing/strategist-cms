import supertest from "supertest";
import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, "../", ".env.test"),
});

const url = process.env.BASE_URL || "http://localhost:3000";

describe("Checking Api's Health" + url, () => {

  test("[GET] Request: /", async () => {
    const response = await supertest(url).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: "OK",
    });
  });

  // describe("Requesting Not exist Page", () => {
  //   test("[GET] Request: /404", async () => {
  //     const response = await supertest(url).get("/404");
  //     expect(response.status).toBe(404);
  //     expect(response.body).toEqual("404");
  //   });
  // });
});
