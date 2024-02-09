import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
import { TODOS_COUNT } from "../../../src/seeds/_constants.js";

let apiContext;

test.describe("Seed Todo App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("POST:/api/v1/seed/todos - Seed Todos", async () => {
    test("should return 0 todos before seed", async ({ page }) => {
      const res = await apiContext.get("/api/v1/todos");
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.length).toEqual(0);
    });

    test("should seed todo DB", async ({ page }) => {
      const res = await apiContext.post("/api/v1/seed/todos");
      expect(res.status()).toEqual(201);
    });

    test(`should return ${TODOS_COUNT} todos after seed`, async ({ page }) => {
      const res = await apiContext.get("/api/v1/todos");
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.length).toEqual(TODOS_COUNT);
    });
  });
});
