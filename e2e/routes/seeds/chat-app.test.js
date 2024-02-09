import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";

let apiContext;

test.describe("Seed Chat App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("POST:/api/v1/seed/chat-app - Seed Chat", async () => {
    test("should seed Chat App DB", async ({ page }) => {
      const res = await apiContext.post("/api/v1/seed/chat-app");
      expect(res.status()).toEqual(201);
    });
  });
});
