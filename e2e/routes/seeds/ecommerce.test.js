import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
import {
  CATEGORIES_COUNT,
  PRODUCTS_COUNT,
} from "../../../src/seeds/_constants.js";

let apiContext;

test.describe("Seed Ecommerce App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("POST:/api/v1/seed/ecommerce - Seed Ecommerce", async () => {
    test("should return 0 products before seed", async ({ page }) => {
      const res = await apiContext.get(
        "/api/v1/ecommerce/products?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalProducts).toEqual(0);
    });
    test("should return 0 categories before seed", async ({ page }) => {
      const res = await apiContext.get(
        "/api/v1/ecommerce/categories?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalCategories).toEqual(0);
    });
    test("should seed ecommerce DB", async ({ page }) => {
      const res = await apiContext.post("/api/v1/seed/ecommerce");
      expect(res.status()).toEqual(201);
    });
    test(`should return ${PRODUCTS_COUNT} products after seed`, async ({
      page,
    }) => {
      const res = await apiContext.get(
        "/api/v1/ecommerce/products?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalProducts).toEqual(PRODUCTS_COUNT);
    });
    test(`should return ${CATEGORIES_COUNT} categories after seed`, async ({
      page,
    }) => {
      const res = await apiContext.get(
        "/api/v1/ecommerce/categories?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalCategories).toEqual(CATEGORIES_COUNT);
    });
  });
});
