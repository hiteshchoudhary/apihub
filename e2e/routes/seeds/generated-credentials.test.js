import fs from "fs";
import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Get credentials", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/seed/generated-credentials - Get credentials", async () => {
    test("should return public/temp/seed-credentials.json content", async ({
      page,
    }) => {
      const seedCredentialsText = fs.readFileSync(
        "./public/temp/seed-credentials.json",
        "utf8"
      );
      const seedCredentials = JSON.parse(seedCredentialsText);
      const res = await apiContext.get("/api/v1/seed/generated-credentials");
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data).toMatchObject(seedCredentials);
    });
  });
});
