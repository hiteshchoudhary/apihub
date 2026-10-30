import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Public search endpoints (case-insensitive)", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test("GET:/api/v1/public/quotes - matches author ignoring case", async ({}) => {
    // "Charles Dickens" in the data; the lowercase query used to never match
    const res = await apiContext.get("/api/v1/public/quotes?query=dickens");
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(7);
    expect(
      json.data.data.every((quote) => quote.author === "Charles Dickens")
    ).toBeTruthy();
  });

  test("GET:/api/v1/public/books - matches volumeInfo.title ignoring case", async ({}) => {
    // "Practices of an Agile Developer" only matches via the title field
    const res = await apiContext.get(
      "/api/v1/public/books?query=practices of an agile developer"
    );
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(1);
    expect(json.data.data[0].volumeInfo.title).toEqual(
      "Practices of an Agile Developer"
    );
  });

  test("GET:/api/v1/public/books - matches volumeInfo.subtitle ignoring case", async ({}) => {
    // "Building Quality Into Software" only matches via the subtitle field
    const res = await apiContext.get(
      "/api/v1/public/books?query=building quality into software"
    );
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(1);
    expect(json.data.data[0].volumeInfo.subtitle).toEqual(
      "Building Quality Into Software"
    );
  });

  test("GET:/api/v1/public/youtube/videos - matches description ignoring case", async ({}) => {
    // "All Amazon links are affiliate links" appears (capitalized) in descriptions
    const res = await apiContext.get(
      "/api/v1/public/youtube/videos?query=amazon"
    );
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toBeGreaterThan(0);
    expect(
      json.data.data.every((video) =>
        video.items.snippet.description?.toLowerCase().includes("amazon")
      )
    ).toBeTruthy();
  });

  test("GET:/api/v1/public/youtube/videos - matches tags ignoring case", async ({}) => {
    // "Programming languages" tag exists only in tags (not in any title/description),
    // so a lowercase query can only match through the tags field
    const res = await apiContext.get(
      "/api/v1/public/youtube/videos?query=programming languages"
    );
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(2);
    expect(
      json.data.data.every((video) =>
        video.items.snippet.tags?.some((tag) =>
          tag.toLowerCase().includes("programming languages")
        )
      )
    ).toBeTruthy();
  });

  test("GET:/api/v1/public/stocks - matches Symbol ignoring case", async ({}) => {
    // Symbol "A2ZINFRA" is all uppercase; the lowercase query used to never match
    const res = await apiContext.get("/api/v1/public/stocks?query=a2zinfra");
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(1);
    expect(json.data.data[0].Symbol).toEqual("A2ZINFRA");
  });

  test("GET:/api/v1/public/meals - matches strCategory ignoring case", async ({}) => {
    // "Miscellaneous" category; the lowercase query used to never match
    const res = await apiContext.get(
      "/api/v1/public/meals?query=miscellaneous"
    );
    const json = await res.json();
    expect(res.status()).toEqual(200);
    expect(json.data.totalItems).toEqual(11);
    expect(
      json.data.data.every((meal) => meal.strCategory === "Miscellaneous")
    ).toBeTruthy();
  });
});
