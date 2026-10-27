import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";

let apiContext;

test.describe("Sudoku App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe("GET /api/v1/sudoku", () => {
    test("should generate a Sudoku puzzle", async () => {
      const response = await apiContext.get("/api/v1/sudoku");

      expect(response.status()).toBe(200);

      const json = await response.json();

      expect(json.statusCode).toBe(200);
      expect(json.data).toBeTruthy();
      expect(json.data.grid).toHaveLength(9);
      expect(json.data.grid.every((row) => row.length === 9)).toBe(true);
    });

    test("should generate a puzzle with its solution when requested", async () => {
      const response = await apiContext.get(
        "/api/v1/sudoku?with-solution=true"
      );

      expect(response.status()).toBe(200);

      const json = await response.json();

      expect(json.statusCode).toBe(200);
      expect(json.data.solution).toHaveLength(9);
      expect(json.data.solution.every((row) => row.length === 9)).toBe(true);
    });

    test("should reject an unsupported difficulty", async () => {
      const response = await apiContext.get(
        "/api/v1/sudoku?difficulty=INVALID"
      );

      expect(response.status()).toBe(400);
    });
  });

  test("GET /api/v1/sudoku/difficulties should return supported difficulties", async () => {
    const response = await apiContext.get("/api/v1/sudoku/difficulties");

    expect(response.status()).toBe(200);

    const json = await response.json();

    expect(json.statusCode).toBe(200);
    expect(json.data).toBeTruthy();
  });

  test("POST /api/v1/sudoku/validate should validate a Sudoku grid", async () => {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    const response = await apiContext.post("/api/v1/sudoku/validate", {
      data: { grid },
    });

    expect(response.status()).toBe(200);

    const json = await response.json();

    expect(json.statusCode).toBe(200);
    expect(json.data.valid).toBe(true);
    expect(json.data.complete).toBe(false);
  });

  test("POST /api/v1/sudoku/solve should reject an invalid grid shape", async () => {
    const response = await apiContext.post("/api/v1/sudoku/solve", {
      data: {
        grid: [
          [1, 2],
          [3, 4],
        ],
      },
    });

    expect(response.status()).toBe(400);
  });

  test("POST /api/v1/sudoku/check should reject malformed input", async () => {
    const response = await apiContext.post("/api/v1/sudoku/check", {
      data: { puzzle: [[1]], solution: [[1]] },
    });

    expect(response.status()).toBe(400);
  });

  test("POST /api/v1/sudoku/unique should reject malformed input", async () => {
    const response = await apiContext.post("/api/v1/sudoku/unique", {
      data: {
        grid: [
          [1, 2],
          [3, 4],
        ],
      },
    });

    expect(response.status()).toBe(400);
  });
});
