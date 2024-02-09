import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
let apiContext;

let todoId = null;

test.describe("Todo App", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("GET:/api/v1/todos - Get All Todos", () => {
    test("should return all todos", async () => {
      const res = await apiContext.get(`/api/v1/todos`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.data.length).toEqual(0);
    });
  });

  test.describe("POST:/api/v1/todos - Create Todo", () => {
    test("should create todo with valid data", async () => {
      const todo = {
        title: "test-todo-title",
        description: "test-todo-description",
      };
      const res = await apiContext.post(`/api/v1/todos`, {
        data: todo,
      });
      const json = await res.json();
      expect(res.status()).toEqual(201);
      expect(json.statusCode).toEqual(201);
      expect(json.data).toMatchObject(todo);
      todoId = json.data._id;
    });

    test("should return a 422 with title error when `title` is not provided", async () => {
      const todo = {};
      const res = await apiContext.post(`/api/v1/todos`, {
        data: todo,
      });
      const json = await res.json();
      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ title: expect.anything() })
      );
    });

    test("should return a 422 with title and description error when `title` and `description` is empty", async () => {
      const todo = { title: "", description: "" };
      const res = await apiContext.post(`/api/v1/todos`, {
        data: todo,
      });
      const json = await res.json();
      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ title: expect.anything() })
      );
      expect(json.errors).toContainEqual(
        expect.objectContaining({ description: expect.anything() })
      );
    });
  });

  test.describe("PATCH:/api/v1/todos/:id - Update Todo", () => {
    const todo = {
      title: "update-test-todo-title",
      description: "update-test-todo-description",
    };

    test("should update todo with valid data", async () => {
      const res = await apiContext.patch(`/api/v1/todos/${todoId}`, {
        data: todo,
      });
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(200);
      expect(json.data).toMatchObject(todo);
    });

    test("should return a 422 with title and description error when `title` and `description` is empty", async () => {
      const todo = { title: "", description: "" };
      const res = await apiContext.patch(`/api/v1/todos/${todoId}`, {
        data: todo,
      });
      const json = await res.json();
      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ title: expect.anything() })
      );
      expect(json.errors).toContainEqual(
        expect.objectContaining({ description: expect.anything() })
      );
    });
  });

  test.describe("PATCH:/api/v1/todos/toggle/status/:id - Toggle todo status", () => {
    test("should toggle todo status", async () => {
      const res = await apiContext.patch(
        `/api/v1/todos/toggle/status/${todoId}`
      );
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(res.status());
      expect(json.data.isComplete).toBeTruthy();
    });
  });

  test.describe("GET:/api/v1/todos - Get All Todos", () => {
    test("should return todo when valid id passed", async () => {
      const res = await apiContext.get(`/api/v1/todos/${todoId}`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(res.status());
    });

    test("should return 422 with todoId error when invalid id passed", async () => {
      const res = await apiContext.get(`/api/v1/todos/__1`);
      const json = await res.json();
      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(res.status());
      expect(json.errors).toContainEqual(
        expect.objectContaining({ todoId: expect.anything() })
      );
    });
  });

  test.describe("DELETE:/api/v1/todos/:id - Delete Todo", () => {
    test("should delete todo", async () => {
      const res = await apiContext.delete(`/api/v1/todos/${todoId}`);
      const json = await res.json();
      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(res.status());
    });
  });
});
