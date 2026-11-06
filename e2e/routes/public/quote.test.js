import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Public APIs - Quotes", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/public/quotes - Get Quotes", () => {
    test("should return default paginated list of quotes (page 1, limit 10)", async () => {
      const res = await apiContext.get("/api/v1/public/quotes");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.statusCode).toEqual(200);
      expect(json.message).toEqual("Quotes fetched successfully");

      const payload = json.data;
      expect(payload.page).toEqual(1);
      expect(payload.limit).toEqual(10);
      expect(payload.data.length).toEqual(10);
      expect(payload.currentPageItems).toEqual(10);
      expect(payload.totalItems).toBeGreaterThan(0);
      expect(payload.totalPages).toBeGreaterThan(0);
      expect(payload.nextPage).toBeTruthy();
      expect(payload.previousPage).toBeFalsy();
    });

    test("should handle custom pagination (page 2, limit 5)", async () => {
      const res = await apiContext.get("/api/v1/public/quotes?page=2&limit=5");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();

      const payload = json.data;
      expect(payload.page).toEqual(2);
      expect(payload.limit).toEqual(5);
      expect(payload.data.length).toEqual(5);
      expect(payload.currentPageItems).toEqual(5);
      expect(payload.previousPage).toBeTruthy();
      expect(payload.nextPage).toBeTruthy();
    });

    test("should filter quotes by search query", async () => {
      const res = await apiContext.get("/api/v1/public/quotes?query=life");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toBeGreaterThan(0);
    });

    test("should return empty list when search query yields no matches", async () => {
      const res = await apiContext.get(
        "/api/v1/public/quotes?query=nonexistentquotequeryxyz999"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(0);
      expect(json.data.totalItems).toEqual(0);
    });

    test("should filter fields when inc parameter is provided", async () => {
      const res = await apiContext.get(
        "/api/v1/public/quotes?limit=2&inc=id,author"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(2);

      for (const item of json.data.data) {
        expect(Object.keys(item).sort()).toEqual(["id", "author"].sort());
      }
    });
  });

  test.describe("GET:/api/v1/public/quotes/:quoteId - Get Quote By ID", () => {
    test("should return quote details when valid quoteId is passed", async () => {
      const res = await apiContext.get("/api/v1/public/quotes/1");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.id).toEqual(1);
      expect(json.data.author).toBeDefined();
      expect(json.data.content).toBeDefined();
    });

    test("should return 404 when non-existent quoteId is passed", async () => {
      const res = await apiContext.get("/api/v1/public/quotes/999999");
      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Quote does not exist.");
    });
  });

  test.describe("GET:/api/v1/public/quotes/quote/random - Get Random Quote", () => {
    test("should return a random quote", async () => {
      const res = await apiContext.get("/api/v1/public/quotes/quote/random");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.id).toBeDefined();
      expect(json.data.author).toBeDefined();
      expect(json.data.content).toBeDefined();
    });
  });
});
