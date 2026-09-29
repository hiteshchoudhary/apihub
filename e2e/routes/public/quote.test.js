import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Public Quotes", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });
  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/public/quotes - Get Quotes", () => {
    test("should return paginated quotes", async () => {
      const res = await apiContext.get(`/api/v1/public/quotes?limit=5`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.data.length).toEqual(5);
    });

    test("should match quote content regardless of letter case", async () => {
      const lower = await (
        await apiContext.get(`/api/v1/public/quotes?query=life&limit=100`)
      ).json();
      const upper = await (
        await apiContext.get(`/api/v1/public/quotes?query=LIFE&limit=100`)
      ).json();
      expect(lower.data.data.length).toBeGreaterThan(0);
      expect(upper.data.data.length).toEqual(lower.data.data.length);
    });

    test("should match quote author regardless of letter case", async () => {
      const res = await apiContext.get(
        `/api/v1/public/quotes?query=dickens&limit=100`
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.data.length).toBeGreaterThan(0);
    });

    test("should return an empty list when nothing matches", async () => {
      const res = await apiContext.get(
        `/api/v1/public/quotes?query=zzzz-no-such-quote`
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.data.length).toEqual(0);
    });
  });

  test.describe("GET:/api/v1/public/quotes/:quoteId - Get Quote By Id", () => {
    test("should return a quote for a valid id", async () => {
      const res = await apiContext.get(`/api/v1/public/quotes/1`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.id).toEqual(1);
    });

    test("should return 404 for a quote id that does not exist", async () => {
      const res = await apiContext.get(`/api/v1/public/quotes/999999`);
      expect(res.status()).toEqual(404);
    });
  });
});
