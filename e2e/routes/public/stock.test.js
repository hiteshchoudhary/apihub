import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Public APIs - Stocks", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/public/stocks - Get Stocks", () => {
    test("should return default paginated list of stocks (page 1, limit 10)", async () => {
      const res = await apiContext.get("/api/v1/public/stocks");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.statusCode).toEqual(200);
      expect(json.message).toEqual("Stocks fetched successfully");

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
      const res = await apiContext.get("/api/v1/public/stocks?page=2&limit=5");
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

    test("should filter stocks by search query", async () => {
      const res = await apiContext.get("/api/v1/public/stocks?query=tata");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toBeGreaterThan(0);
    });

    test("should return empty list when search query yields no matches", async () => {
      const res = await apiContext.get(
        "/api/v1/public/stocks?query=nonexistentstockqueryxyz999"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(0);
      expect(json.data.totalItems).toEqual(0);
    });

    test("should filter fields when inc parameter is provided", async () => {
      const res = await apiContext.get(
        "/api/v1/public/stocks?limit=2&inc=Symbol,Name"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(2);

      for (const item of json.data.data) {
        expect(Object.keys(item).sort()).toEqual(["Symbol", "Name"].sort());
      }
    });
  });

  test.describe("GET:/api/v1/public/stocks/:stockSymbol - Get Stock By Symbol", () => {
    test("should return stock details when valid symbol is passed", async () => {
      const res = await apiContext.get("/api/v1/public/stocks/20MICRONS");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.Symbol).toEqual("20MICRONS");
      expect(json.data.Name).toBeDefined();
    });

    test("should handle case-insensitive stock symbol lookup", async () => {
      const res = await apiContext.get("/api/v1/public/stocks/20microns");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.Symbol).toEqual("20MICRONS");
    });

    test("should return 404 when non-existent stockSymbol is passed", async () => {
      const res = await apiContext.get(
        "/api/v1/public/stocks/NONEXISTENTSYMBOL999"
      );
      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Stock does not exist.");
    });
  });

  test.describe("GET:/api/v1/public/stocks/stock/random - Get Random Stock", () => {
    test("should return a random stock", async () => {
      const res = await apiContext.get("/api/v1/public/stocks/stock/random");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.Symbol).toBeDefined();
      expect(json.data.Name).toBeDefined();
    });
  });
});
