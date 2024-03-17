import { test, expect } from "@playwright/test";
import { getApiContext } from "../common.js";

let apiContext;

test.describe("Healthcheck", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test("should return ok", async ({ page }) => {
    const res = await apiContext.get("/api/v1/healthcheck");
    expect(res.ok()).toBeTruthy();
  });
});
