import { successResponse } from "./response";

describe("Unit Testing for Utilities", () => {
  it("Helper Function: Success Response", () => {
    const result = successResponse(200, "Hello", "something");
    expect(result.data).toEqual("something")
    expect(result.message).toEqual("Hello")
    expect(result.statusCode).toEqual(200)
  });
});
