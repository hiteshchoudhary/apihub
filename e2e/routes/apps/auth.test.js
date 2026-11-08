import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";

let apiContext;
let unauthenticatedContext;
let accessToken;

const testUser = {
  email: "auth-test@example.com",
  username: "authtestuser",
  password: "Test@123456",
};

test.describe("Authentication - User", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    unauthenticatedContext = await getApiContext(playwright);

    await clearDB();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
    await unauthenticatedContext.dispose();
  });

  test.describe("POST:/api/v1/users/register - Register User", () => {
    test("should register a user with valid data", async () => {
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: testUser,
      });

      const json = await res.json();

      expect(res.status()).toEqual(201);
      expect(json.statusCode).toEqual(200);
      expect(json.data.user).toBeDefined();
      expect(json.data.user.email).toEqual(testUser.email);
      expect(json.data.user.username).toEqual(testUser.username);
    });

    test("should return 422 when required registration fields are missing", async () => {
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: {},
      });

      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);

      expect(json.errors).toContainEqual(
        expect.objectContaining({ email: expect.anything() })
      );

      expect(json.errors).toContainEqual(
        expect.objectContaining({ username: expect.anything() })
      );

      expect(json.errors).toContainEqual(
        expect.objectContaining({ password: expect.anything() })
      );
    });

    test("should return 422 when email is invalid", async () => {
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: {
          ...testUser,
          email: "invalid-email",
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);

      expect(json.errors).toContainEqual(
        expect.objectContaining({ email: expect.anything() })
      );
    });

    test("should return 422 when username is not lowercase", async () => {
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: {
          ...testUser,
          email: "uppercase-test@example.com",
          username: "AuthTestUser",
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);

      expect(json.errors).toContainEqual(
        expect.objectContaining({ username: expect.anything() })
      );
    });

    test("should return 409 when email or username already exists", async () => {
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: testUser,
      });

      const json = await res.json();

      expect(res.status()).toEqual(409);
      expect(json.statusCode).toEqual(409);
    });
  });

  test.describe("POST:/api/v1/users/login - Login User", () => {
    test("should login with valid credentials", async () => {
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(200);
      expect(json.data.user).toBeDefined();
      expect(json.data.accessToken).toBeDefined();
      expect(json.data.refreshToken).toBeDefined();

      accessToken = json.data.accessToken;
    });

    test("should return 422 when password is missing", async () => {
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: {
          email: testUser.email,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.statusCode).toEqual(422);

      expect(json.errors).toContainEqual(
        expect.objectContaining({ password: expect.anything() })
      );
    });

    test("should return 404 when user does not exist", async () => {
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: {
          email: "nonexistent@example.com",
          password: testUser.password,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.statusCode).toEqual(404);
    });

    test("should return 401 when password is incorrect", async () => {
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: {
          email: testUser.email,
          password: "WrongPassword@123",
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.statusCode).toEqual(401);
    });

    test("should return 400 when email and username are missing", async () => {
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: {
          password: testUser.password,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(400);
      expect(json.statusCode).toEqual(400);
    });
  });

  test.describe("GET:/api/v1/users/current-user - Get Current User", () => {
    test("should return current user with valid access token", async () => {
      const res = await apiContext.get(`/api/v1/users/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(200);
      expect(json.data.email).toEqual(testUser.email);
      expect(json.data.username).toEqual(testUser.username);
    });

    test("should return 401 without authentication", async () => {
      const res = await unauthenticatedContext.get(
        `/api/v1/users/current-user`
      );

      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.statusCode).toEqual(401);
    });
  });

  test.describe("POST:/api/v1/users/logout - Logout User", () => {
    test("should logout with valid access token", async () => {
      const res = await apiContext.post(`/api/v1/users/logout`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.statusCode).toEqual(200);
    });

    test("should return 401 without authentication", async () => {
      const res = await unauthenticatedContext.post(`/api/v1/users/logout`);

      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.statusCode).toEqual(401);
    });
  });

  test.describe("POST:/api/v1/users/refresh-token - Refresh Access Token", () => {
    test("should return 401 when refresh token is missing", async () => {
      const res = await unauthenticatedContext.post(
        `/api/v1/users/refresh-token`
      );

      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.statusCode).toEqual(401);
    });
  });

  test.describe("POST:/api/v1/users/change-password - Change Password", () => {
    test("should return 400 when old password is incorrect", async () => {
      const res = await apiContext.post(`/api/v1/users/change-password`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          oldPassword: "WrongPassword@123",
          newPassword: "NewPassword@123",
        },
      });

      const json = await res.json();

      expect(res.status()).toEqual(400);
      expect(json.statusCode).toEqual(400);
    });
  });
});
