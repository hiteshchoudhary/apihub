import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Public APIs - Books", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/public/books - Get Books", () => {
    test("should return default paginated list of books (page 1, limit 10)", async () => {
      const res = await apiContext.get("/api/v1/public/books");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.statusCode).toEqual(200);
      expect(json.message).toEqual("Books fetched successfully");

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
      const res = await apiContext.get("/api/v1/public/books?page=2&limit=5");
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

    test("should filter books by search query", async () => {
      const res = await apiContext.get("/api/v1/public/books?query=javascript");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toBeGreaterThan(0);
    });

    test("should return empty list when search query yields no matches", async () => {
      const res = await apiContext.get(
        "/api/v1/public/books?query=nonexistentbookqueryxyz999"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(0);
      expect(json.data.totalItems).toEqual(0);
      expect(json.data.previousPage).toBeFalsy();
      expect(json.data.nextPage).toBeFalsy();
    });

    test("should filter fields when inc parameter is provided", async () => {
      const res = await apiContext.get(
        "/api/v1/public/books?limit=2&inc=id,kind"
      );
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.data.length).toEqual(2);

      for (const item of json.data.data) {
        expect(Object.keys(item).sort()).toEqual(["id", "kind"].sort());
      }
    });
  });

  test.describe("GET:/api/v1/public/books/:bookId - Get Book By ID", () => {
    test("should return book details when valid bookId is passed", async () => {
      const res = await apiContext.get("/api/v1/public/books/1");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.id).toEqual(1);
      expect(json.data.volumeInfo).toBeDefined();
    });

    test("should return 404 when non-existent bookId is passed", async () => {
      const res = await apiContext.get("/api/v1/public/books/999999");
      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Book does not exist.");
    });
  });

  test.describe("GET:/api/v1/public/books/book/random - Get Random Book", () => {
    test("should return a random book", async () => {
      const res = await apiContext.get("/api/v1/public/books/book/random");
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data).toBeDefined();
      expect(json.data.id).toBeDefined();
      expect(json.data.volumeInfo).toBeDefined();
    });
  });
});
