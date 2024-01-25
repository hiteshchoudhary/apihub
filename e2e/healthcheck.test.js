import { test, expect } from "@playwright/test";
import { getApiContext, URL } from "./common.js";

let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await getApiContext(playwright);
});

test.afterAll(async ({}) => {
  await apiContext.dispose();
});

test("should return ok", async ({ page }) => {
  const res = await apiContext.get(`/api/v1/healthcheck`);
  expect(res.ok()).toBeTruthy();
});
