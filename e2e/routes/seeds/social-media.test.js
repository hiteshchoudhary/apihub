import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
import { SOCIAL_POSTS_COUNT } from "../../../src/seeds/_constants.js";

let apiContext;

test.describe("Seed social-media App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("POST:/api/v1/seed/social-media - Seed social-media", async () => {
    test("should return 0 posts before seed", async ({ page }) => {
      const res = await apiContext.get(
        "/api/v1/social-media/posts?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalPosts).toEqual(0);
    });
    test("should seed social-media DB", async ({ page }) => {
      const res = await apiContext.post("/api/v1/seed/social-media");
      expect(res.status()).toEqual(201);
    });
    test(`should return ${SOCIAL_POSTS_COUNT} post after seed`, async ({
      page,
    }) => {
      const res = await apiContext.get(
        "/api/v1/social-media/posts?page=1&limit=1"
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.totalPosts).toEqual(SOCIAL_POSTS_COUNT);
    });
  });
});
