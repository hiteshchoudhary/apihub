import { test, expect } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";

let apiContext;

const registerData = {
  email: "register_test@example.com",
  username: "registeruser",
  password: "Password123!",
};

test.describe("User Authentication & Profile API", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // -------------------------------------------------------------
  // Registration Tests
  // -------------------------------------------------------------
  test.describe("POST:/api/v1/users/register - Register User", () => {
    test("should register a user with valid credentials", async () => {
      const res = await apiContext.post("/api/v1/users/register", {
        data: registerData,
      });
      const json = await res.json();

      expect(res.status()).toEqual(201);
      expect(json.success).toBeTruthy();
      expect(json.data.user).toBeDefined();
      expect(json.data.user.email).toEqual(registerData.email);
      expect(json.data.user.username).toEqual(registerData.username);
      expect(json.data.user.role).toEqual("USER");
      expect(json.data.user.isEmailVerified).toBeFalsy();
      expect(json.data.user.password).toBeUndefined();
    });

    test("should return 409 when registering with duplicate email", async () => {
      const res = await apiContext.post("/api/v1/users/register", {
        data: {
          email: registerData.email,
          username: "differentuser",
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(409);
      expect(json.success).toBeFalsy();
      expect(json.message).toContain("already exists");
    });

    test("should return 409 when registering with duplicate username", async () => {
      const res = await apiContext.post("/api/v1/users/register", {
        data: {
          email: "another_unique@example.com",
          username: registerData.username,
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(409);
      expect(json.success).toBeFalsy();
      expect(json.message).toContain("already exists");
    });

    test("should return 422 when required fields are missing", async () => {
      const res = await apiContext.post("/api/v1/users/register", {
        data: {},
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.success).toBeFalsy();
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
      const res = await apiContext.post("/api/v1/users/register", {
        data: {
          email: "invalid-email-format",
          username: "validusername",
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ email: "Email is invalid" })
      );
    });

    test("should return 422 when username is shorter than 3 characters or not lowercase", async () => {
      const res = await apiContext.post("/api/v1/users/register", {
        data: {
          email: "valid@example.com",
          username: "AB",
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ username: expect.anything() })
      );
    });
  });

  // -------------------------------------------------------------
  // Login Validation & Error Tests
  // -------------------------------------------------------------
  test.describe("POST:/api/v1/users/login - Login Errors & Validations", () => {
    test("should return 401 when password is wrong", async () => {
      const res = await apiContext.post("/api/v1/users/login", {
        data: {
          username: registerData.username,
          password: "WrongPassword123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Invalid user credentials");
    });

    test("should return 404 when user does not exist", async () => {
      const res = await apiContext.post("/api/v1/users/login", {
        data: {
          username: "nonexistentuser",
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("User does not exist");
    });

    test("should return 422 when password is not provided", async () => {
      const res = await apiContext.post("/api/v1/users/login", {
        data: {
          username: registerData.username,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ password: expect.anything() })
      );
    });

    test("should return 400 when neither username nor email is provided", async () => {
      const res = await apiContext.post("/api/v1/users/login", {
        data: {
          password: "Password123!",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(400);
      expect(json.message).toEqual("Username or email is required");
    });
  });

  // -------------------------------------------------------------
  // Full Lifecycle: Login -> Current User -> Refresh Token -> Change Password -> Logout
  // -------------------------------------------------------------
  test.describe("Authenticated User Lifecycle", () => {
    let authContext;
    let unauthContext;
    let tokens = {
      accessToken: "",
      refreshToken: "",
    };
    const updatedPassword = "UpdatedPassword456!";

    test.beforeAll(async ({ playwright }) => {
      // Use clean contexts to isolate session cookies
      authContext = await getApiContext(playwright);
      unauthContext = await getApiContext(playwright);
    });

    test.afterAll(async () => {
      await authContext.dispose();
      await unauthContext.dispose();
    });

    test("should login successfully with valid username and password", async () => {
      const res = await authContext.post("/api/v1/users/login", {
        data: {
          username: registerData.username,
          password: registerData.password,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.user).toBeDefined();
      expect(json.data.user.username).toEqual(registerData.username);
      expect(json.data.accessToken).toBeDefined();
      expect(json.data.refreshToken).toBeDefined();

      tokens.accessToken = json.data.accessToken;
      tokens.refreshToken = json.data.refreshToken;
    });

    test("GET:/api/v1/users/current-user - should return current user profile when authenticated", async () => {
      const res = await authContext.get("/api/v1/users/current-user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.username).toEqual(registerData.username);
      expect(json.data.email).toEqual(registerData.email);
    });

    test("GET:/api/v1/users/current-user - should return 401 when request is unauthenticated", async () => {
      const res = await unauthContext.get("/api/v1/users/current-user");
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Unauthorized request");
    });

    test("GET:/api/v1/users/current-user - should return 401 when token is invalid", async () => {
      const res = await unauthContext.get("/api/v1/users/current-user", {
        headers: {
          Authorization: "Bearer invalid.fake.token",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.success).toBeFalsy();
    });

    test("POST:/api/v1/users/refresh-token - should refresh token when valid", async () => {
      const res = await authContext.post("/api/v1/users/refresh-token", {
        data: {
          refreshToken: tokens.refreshToken,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.data.accessToken).toBeDefined();
      expect(json.data.refreshToken).toBeDefined();

      // Update tokens with the freshly rotated values
      tokens.accessToken = json.data.accessToken;
      tokens.refreshToken = json.data.refreshToken;
    });

    test("POST:/api/v1/users/refresh-token - should return 401 when refresh token is missing", async () => {
      const res = await unauthContext.post("/api/v1/users/refresh-token", {
        data: {},
      });
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.message).toEqual("Unauthorized request");
    });

    test("POST:/api/v1/users/refresh-token - should return 401 when refresh token is invalid", async () => {
      const res = await unauthContext.post("/api/v1/users/refresh-token", {
        data: {
          refreshToken: "invalid-token",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.success).toBeFalsy();
    });

    test("POST:/api/v1/users/change-password - should return 400 when old password is incorrect", async () => {
      const res = await authContext.post("/api/v1/users/change-password", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          oldPassword: "WrongOldPassword!",
          newPassword: updatedPassword,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(400);
      expect(json.success).toBeFalsy();
      expect(json.message).toEqual("Invalid old password");
    });

    test("POST:/api/v1/users/change-password - should return 422 when new password is empty", async () => {
      const res = await authContext.post("/api/v1/users/change-password", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          oldPassword: registerData.password,
          newPassword: "",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ newPassword: expect.anything() })
      );
    });

    test("POST:/api/v1/users/change-password - should change password successfully", async () => {
      const res = await authContext.post("/api/v1/users/change-password", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        data: {
          oldPassword: registerData.password,
          newPassword: updatedPassword,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.message).toEqual("Password changed successfully");
    });

    test("POST:/api/v1/users/login - should login with the updated password", async () => {
      const res = await authContext.post("/api/v1/users/login", {
        data: {
          username: registerData.username,
          password: updatedPassword,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();

      tokens.accessToken = json.data.accessToken;
      tokens.refreshToken = json.data.refreshToken;
    });

    test("POST:/api/v1/users/logout - should return 401 when unauthenticated", async () => {
      const res = await unauthContext.post("/api/v1/users/logout");
      const json = await res.json();

      expect(res.status()).toEqual(401);
      expect(json.success).toBeFalsy();
    });

    test("POST:/api/v1/users/logout - should logout successfully when authenticated", async () => {
      const res = await authContext.post("/api/v1/users/logout", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
      expect(json.message).toEqual("User logged out");
    });
  });

  // -------------------------------------------------------------
  // Password Recovery Tests
  // -------------------------------------------------------------
  test.describe("POST:/api/v1/users/forgot-password - Forgot Password", () => {
    test("should handle forgot password request for existing user email", async () => {
      const res = await apiContext.post("/api/v1/users/forgot-password", {
        data: {
          email: registerData.email,
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(200);
      expect(json.success).toBeTruthy();
    });

    test("should return 404 when requested email does not exist", async () => {
      const res = await apiContext.post("/api/v1/users/forgot-password", {
        data: {
          email: "unknown_person@example.com",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(404);
      expect(json.success).toBeFalsy();
    });

    test("should return 422 when email format is invalid", async () => {
      const res = await apiContext.post("/api/v1/users/forgot-password", {
        data: {
          email: "invalid-email-format",
        },
      });
      const json = await res.json();

      expect(res.status()).toEqual(422);
      expect(json.errors).toContainEqual(
        expect.objectContaining({ email: "Email is invalid" })
      );
    });
  });
});
