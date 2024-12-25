import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
let apiContext;

let todoId = null;

test.describe("Exchange App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });
  // Adding only one test case as others are dependent on key
  test.describe("GET:/api/v1/currencies - Get All Currencies", () => {
    test("should return all currencies", async () => {
      const res = await apiContext.get(`/api/v1/currencies`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.length).toBeGreaterThan(0);
    });
  });
});
