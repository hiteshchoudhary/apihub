import { test, expect, request } from "@playwright/test";
import { getApiContext } from "../../common.js";
import { clearDB } from "../../db.js";
import { cookie } from "express-validator";
import fs from "fs";

let apiContext;
const userData = {
  email: "user.email2@domain.com",
  password: "test2@123",
  role: "ADMIN",
  username: "doejohn2",
};

test.describe("Authentication Test", () => {
  test.beforeAll(async ({ playwright }) => {
    apiContext = await getApiContext(playwright);
    await clearDB();
  });
  test.afterAll(async ({}) => {
    await apiContext.dispose();
  });

  test.describe("POST:/api/v1/users/register - Create User", () => {
    test("User should be able to register ", async () => {
      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userData,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(201);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(
        json.data.user.username,
        "Verify value of username in Response"
      ).toEqual(userData.username);
      expect(json.data.user.email, "Verify value of Email in response").toEqual(
        userData.email
      );
      expect(json.data.user.role, "Verify value of Role in Response").toEqual(
        userData.role
      );
      expect(
        json.data.user.loginType,
        "Verify value of loginType in Response"
      ).toEqual("EMAIL_PASSWORD");
      expect(
        json.data.user.isEmailVerified,
        "Verify value of isEmailVerified"
      ).toEqual(false);
      expect(
        json.data.user,
        "Verify Response should have createdAt in json.data.user path"
      ).toHaveProperty("createdAt");
      expect(
        json.data.user,
        "Verify Response should have updatedAt in json.data.user path"
      ).toHaveProperty("updatedAt");
      expect(
        json.data.user,
        "Verify Response should have _id in json.data.user path"
      ).toHaveProperty("_id");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Users registered successfully and verification email has been sent on your email."
      );

      userData.userId = json.data.user._id;
      // userId = json.data.user._id;
    });

    test("Existing user should not be able to register", async () => {
      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userData,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(409);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(409);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "User with email or username already exists"
      );

      // userId = json.data.user._id;
    });

    test("Empty Password Field", async () => {
      let userDataLocal = { ...userData }; // Create a shallow copy to avoid modifying the original
      delete userDataLocal.password;
      console.log("Request Data = ", userDataLocal);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const passwordError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.password)
        : undefined;
      expect(passwordError, "Verify password error exists").toBeDefined();
      expect(
        passwordError?.password,
        "Verify Value of password error in response"
      ).toEqual("Password is required");
    });

    test("Empty Email Field", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.email;
      console.log("Request Data = ", userDataLocal);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      // expect(json.errors[0].email).toEqual("Email is required");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const emailError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.email)
        : undefined;
      expect(emailError, "Verify email error exists").toBeDefined();
      expect(
        emailError?.email,
        "Verify value of email error in response"
      ).toEqual("Email is required");
    });

    test("Invalid email test", async () => {
      let userDataLocal = { ...userData };
      // remove email field from userDataLocal

      userDataLocal.email = "invalid.email2domain.com";
      // userDataLocal.username = "johndoe3";
      console.log("Request Data = ", userDataLocal);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      // expect(json.errors[0].email).toEqual("Email is invalid");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const emailError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.email)
        : undefined;
      expect(emailError, "Verify email error exists").toBeDefined();
      expect(
        emailError?.email,
        "Verify value of email error in response"
      ).toEqual("Email is invalid");
    });

    test("Empty username Field", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.username;
      console.log("Request Data = ", userDataLocal);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      // expect(json.errors[0].username).toEqual("Username is required");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const usernameError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.username)
        : undefined;
      expect(usernameError, "Verify username error exists").toBeDefined();
      expect(
        usernameError?.username,
        "Verify value of username error in response"
      ).toEqual("Username is required");
    });

    test("Username Length Check", async () => {
      const userDataLocal = { ...userData };
      userDataLocal.username = "12";
      console.log("Request Data = ", userDataLocal);
      const res = await apiContext.post(`/api/v1/users/register`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      // expect(json.errors[0].username).toEqual("Username must be at lease 3 characters long");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const usernameError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.username)
        : undefined;
      expect(usernameError, "Verify username error exists").toBeDefined();
      expect(
        usernameError?.username,
        "Verify value of username error in response"
      ).toEqual("Username must be at lease 3 characters long");
    });
  });

  test.describe("POST:/api/v1/users/login - Login User", () => {
    test("User should be able to login with username", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.email;
      delete userDataLocal.userId;

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(
        json.data.user.username,
        "Verify value of username in Response"
      ).toEqual(userData.username);
      expect(json.data.user.email, "Verify value of Email in response").toEqual(
        userData.email
      );
      expect(json.data.user.role, "Verify value of Role in Response").toEqual(
        userData.role
      );
      expect(
        json.data.user.loginType,
        "Verify value of loginType in Response"
      ).toEqual("EMAIL_PASSWORD");
      expect(
        json.data.user.isEmailVerified,
        "Verify value of isEmailVerified"
      ).toEqual(false);
      expect(
        json.data.user,
        "Verify Response should have createdAt in json.data.user path"
      ).toHaveProperty("createdAt");
      expect(
        json.data.user,
        "Verify Response should have updatedAt in json.data.user path"
      ).toHaveProperty("updatedAt");
      expect(
        json.data,
        "Verify Response should have accessToken in json.data path"
      ).toHaveProperty("accessToken");
      expect(
        json.data,
        "Verify Response should have refreshToken in json.data path"
      ).toHaveProperty("refreshToken");
      expect(
        json.data.user,
        "Verify Response should have _id in json.data.user path"
      ).toHaveProperty("_id");
      expect(
        json.data.user,
        "Verify Response should have avatar in json.data.user path"
      ).toHaveProperty("avatar");
      expect(
        json.data.user.avatar,
        "Verify Response should have _id in json.data.avatar path"
      ).toHaveProperty("_id");
      expect(
        json.data.user.avatar,
        "Verify Response should have localPath in json.data.avatar path"
      ).toHaveProperty("localPath");
      expect(
        json.data.user.avatar,
        "Verify Response should have url in json.data.avatar path"
      ).toHaveProperty("url");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "User logged in successfully"
      );
      expect(json.data.user._id).toEqual(userData.userId);

      // userId = json.data.user._id;
    });

    test("User should be able to login with email", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.username;
      delete userDataLocal.userId;

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(
        json.data.user.username,
        "Verify value of username in Response"
      ).toEqual(userData.username);
      expect(json.data.user.email, "Verify value of Email in response").toEqual(
        userData.email
      );
      expect(json.data.user.role, "Verify value of Role in Response").toEqual(
        userData.role
      );
      expect(
        json.data.user.loginType,
        "Verify value of loginType in Response"
      ).toEqual("EMAIL_PASSWORD");
      expect(
        json.data.user.isEmailVerified,
        "Verify value of isEmailVerified"
      ).toEqual(false);
      expect(
        json.data.user,
        "Verify Response should have createdAt in json.data.user path"
      ).toHaveProperty("createdAt");
      expect(
        json.data.user,
        "Verify Response should have updatedAt in json.data.user path"
      ).toHaveProperty("updatedAt");
      expect(
        json.data,
        "Verify Response should have accessToken in json.data path"
      ).toHaveProperty("accessToken");
      expect(
        json.data,
        "Verify Response should have refreshToken in json.data path"
      ).toHaveProperty("refreshToken");
      expect(
        json.data.user,
        "Verify Response should have _id in json.data.user path"
      ).toHaveProperty("_id");
      expect(
        json.data.user,
        "Verify Response should have avatar in json.data.user path"
      ).toHaveProperty("avatar");
      expect(
        json.data.user.avatar,
        "Verify Response should have _id in json.data.avatar path"
      ).toHaveProperty("_id");
      expect(
        json.data.user.avatar,
        "Verify Response should have localPath in json.data.avatar path"
      ).toHaveProperty("localPath");
      expect(
        json.data.user.avatar,
        "Verify Response should have url in json.data.avatar path"
      ).toHaveProperty("url");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "User logged in successfully"
      );
      expect(json.data.user._id).toEqual(userData.userId);
      userData.accessToken = json.data.accessToken;
      userData.refreshToken = json.data.refreshToken;

      // userId = json.data.user._id;
    });

    test("User should not be able to login with invalid password", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.email;
      delete userDataLocal.userId;
      userDataLocal.password = "invalidpassword";

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(401);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(401);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Invalid user credentials"
      );

      // const passwordError = Array.isArray(json.errors) ? json.errors.find(error => error.password) : undefined;
      // expect(passwordError,"Verify password error exists").toBeDefined();
      // expect(passwordError?.password,"Verify Value of password error in response").toEqual('Password is required');
    });

    test("User should not be able to login with invalid username", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.email;
      delete userDataLocal.userId;
      userDataLocal.username = "invalidusername";

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(404);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(404);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      // expect(json.errors[0].username).toEqual("Username is required");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "User does not exist"
      );

      // userId = json.data.user._id;
    });

    test("User should not be able to login with without password", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.email;
      delete userDataLocal.userId;
      delete userDataLocal.password;

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(422);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(422);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Received data is not valid"
      );

      const passwordError = Array.isArray(json.errors)
        ? json.errors.find((error) => error.password)
        : undefined;
      expect(passwordError, "Verify password error exists").toBeDefined();
      expect(
        passwordError?.password,
        "Verify Value of password error in response"
      ).toEqual("Password is required");

      // userId = json.data.user._id;
    });

    test("User should not be able to login with without email id / username", async () => {
      let userDataLocal = { ...userData };
      delete userDataLocal.role;
      delete userDataLocal.email;
      delete userDataLocal.userId;
      delete userDataLocal.username;

      console.log("Request Data = ", userData);
      const res = await apiContext.post(`/api/v1/users/login`, {
        data: userDataLocal,
      });
      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(400);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(400);
      expect(json.data).toEqual(null);
      expect(
        json,
        "Verify Response should have stack in json path"
      ).toHaveProperty("stack");
      expect(json.success, "Verify Value of success is false").toEqual(false);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Username or email is required"
      );
    });
  });

  test.describe("GET:/api/v1/users/current-user - Get logged in user", () => {
    test("Get Details of Logged in User", async () => {
      console.log("Request Data = ", userData);
      const res = await apiContext.get(
        `/api/v1/users/current-user`,
        cookie(userData.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      // FIXME:Data is coming in data instead of data.user
      // expect(json.data.user.username,"Verify value of username in Response").toEqual(userData.username);
      // expect(json.data.user.email,"Verify value of Email in response").toEqual(userData.email);
      // expect(json.data.user.role,"Verify value of Role in Response").toEqual(userData.role);
      // expect(json.data.user.loginType,"Verify value of loginType in Response").toEqual("EMAIL_PASSWORD");
      // expect(json.data.user.isEmailVerified,"Verify value of isEmailVerified").toEqual(false);
      // expect(json.data.user,"Verify Response should have createdAt in json.data.user path").toHaveProperty("createdAt");
      // expect(json.data.user,"Verify Response should have updatedAt in json.data.user path").toHaveProperty("updatedAt");
      // expect(json.data.user,"Verify Response should have _id in json.data.user path").toHaveProperty("_id");
      // expect(json.data.user,"Verify Response should have avatar in json.data.user path").toHaveProperty("avatar");
      // expect(json.data.user.avatar,"Verify Response should have _id in json.data.avatar path").toHaveProperty("_id");
      // expect(json.data.user.avatar,"Verify Response should have localPath in json.data.avatar path").toHaveProperty("localPath");
      // expect(json.data.user.avatar,"Verify Response should have url in json.data.avatar path").toHaveProperty("url");
      // expect(json.data.user._id).toEqual(userData.userId);

      expect(
        json.data.username,
        "Verify value of username in Response"
      ).toEqual(userData.username);
      expect(json.data.email, "Verify value of Email in response").toEqual(
        userData.email
      );
      expect(json.data.role, "Verify value of Role in Response").toEqual(
        userData.role
      );
      expect(
        json.data.loginType,
        "Verify value of loginType in Response"
      ).toEqual("EMAIL_PASSWORD");
      expect(
        json.data.isEmailVerified,
        "Verify value of isEmailVerified"
      ).toEqual(false);
      expect(
        json.data,
        "Verify Response should have createdAt in json.data path"
      ).toHaveProperty("createdAt");
      expect(
        json.data,
        "Verify Response should have updatedAt in json.data path"
      ).toHaveProperty("updatedAt");
      expect(
        json.data,
        "Verify Response should have _id in json.data path"
      ).toHaveProperty("_id");
      expect(
        json.data,
        "Verify Response should have avatar in json.data path"
      ).toHaveProperty("avatar");
      expect(
        json.data.avatar,
        "Verify Response should have _id in json.data.avatar path"
      ).toHaveProperty("_id");
      expect(
        json.data.avatar,
        "Verify Response should have localPath in json.data.avatar path"
      ).toHaveProperty("localPath");
      expect(
        json.data.avatar,
        "Verify Response should have url in json.data.avatar path"
      ).toHaveProperty("url");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Current user fetched successfully"
      );
      expect(json.data._id).toEqual(userData.userId);

      // userId = json.data.user._id;
    });
  });

  test.describe("POST:/api/v1/users/refresh-token - Refresh Token", () => {
    test("Referesh Token", async () => {
      // console.log("Request Data = ",userData);
      const res = await apiContext.post(
        `/api/v1/users/refresh-token`,
        cookie(userData.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(
        json.data,
        "Verify Response should have accessToken in json.data path"
      ).toHaveProperty("accessToken");
      expect(
        json.data,
        "Verify Response should have refreshToken in json.data path"
      ).toHaveProperty("refreshToken");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Access token refreshed"
      );
      userData.accessToken = json.data.accessToken;
      userData.refreshToken = json.data.refreshToken;
      // userId = json.data.user._id;
    });
  });

  test.describe("POST:/api/v1/users/assign-role/{userId}- Assign role", () => {
    test("Assign role", async () => {
      let requestData = {
        role: "ADMIN",
      };
      console.log("Request Data = ", requestData);
      const res = await apiContext.post(
        `/api/v1/users/assign-role/${userData.userId}`,
        {
          data: requestData,
        },
        cookie(userData.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json, "Verify Data exists in response").toHaveProperty("data");
      expect(json.message, "Verify value of message is Response").toEqual(
        "Role changed for the user"
      );
    });
  });

  test.describe("POST:/api/v1/users/resend-email-verification Resend email verification", () => {
    test("Resend email verification", async () => {
      // console.log("Request Data = ",requestData);
      const res = await apiContext.post(
        `/api/v1/users/resend-email-verification`,
        cookie(userData.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json, "Verify Data exists in response").toHaveProperty("data");
      expect(json.message, "Verify value of message is Response").toEqual(
        "Mail has been sent to your mail ID"
      );
    });
  });

  test.describe("POST:/api/v1/users/change-password Change current password", () => {
    test("Resend email verification", async () => {
      let userDataLocal = { ...userData };
      let requestData = {
        oldPassword: userDataLocal.password,
        newPassword: "test2@1234",
      };
      console.log("Request Data = ", requestData);
      const res = await apiContext.post(
        `/api/v1/users/change-password`,
        {
          data: requestData,
        },
        cookie(userData.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json, "Verify Data exists in response").toHaveProperty("data");
      expect(json.message, "Verify value of message is Response").toEqual(
        "Password changed successfully"
      );
    });
  });

  // test.describe("POST:/api/v1/reset-password/{resetToken} Reset forgotten password", () => {});

  test.describe("PATCH /api/v1/users/avatar - Update Avatar", () => {
    test("Update avatar with a valid image", async () => {
      const filePath = "./public/assets/images/gaearon.jpg"; // Ensure the path is correct and accessible

      const fileStream = fs.createReadStream(filePath);
      const formData = {
        avatar: fileStream, // Attach the file stream directly
      };
      console.log("Uploading file from:", filePath);

      // Make the PATCH request
      const response = await apiContext.patch("/api/v1/users/avatar", {
        multipart: formData,
      });

      const json = await response.json();

      console.log("Response JSON:", json);
      expect(
        json.data.username,
        "Verify value of username in Response"
      ).toEqual(userData.username);
      expect(json.data.email, "Verify value of Email in response").toEqual(
        userData.email
      );
      expect(json.data.role, "Verify value of Role in Response").toEqual(
        userData.role
      );
      expect(
        json.data.loginType,
        "Verify value of loginType in Response"
      ).toEqual("EMAIL_PASSWORD");
      expect(
        json.data.isEmailVerified,
        "Verify value of isEmailVerified"
      ).toEqual(false);
      expect(
        json.data,
        "Verify Response should have createdAt in json.data path"
      ).toHaveProperty("createdAt");
      expect(
        json.data,
        "Verify Response should have updatedAt in json.data path"
      ).toHaveProperty("updatedAt");
      expect(
        json.data,
        "Verify Response should have _id in json.data path"
      ).toHaveProperty("_id");
      expect(
        json.data,
        "Verify Response should have avatar in json.data path"
      ).toHaveProperty("avatar");
      expect(
        json.data.avatar,
        "Verify Response should have _id in json.data.avatar path"
      ).toHaveProperty("_id");
      expect(
        json.data.avatar,
        "Verify Response should have localPath in json.data.avatar path"
      ).toHaveProperty("localPath");
      expect(
        json.data.avatar,
        "Verify Response should have url in json.data.avatar path"
      ).toHaveProperty("url");
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json.message, "Verify value of message is Response").toEqual(
        "Avatar updated successfully"
      );
      expect(json.data._id).toEqual(userData.userId);
    });
  });

  test.describe("POST:/api/v1/users/logout - Log Out user", () => {
    test("Logout User", async () => {
      let userDataLocal = { ...userData };

      console.log("accessToken = ", userDataLocal.accessToken);
      const res = await apiContext.post(
        `/api/v1/users/logout`,
        cookie(userDataLocal.accessToken)
      );

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json, "Verify Data exists in response").toHaveProperty("data");
      expect(json.message, "Verify value of message is Response").toEqual(
        "User logged out"
      );
    });
  });

  test.describe("POST:/api/v1/users/forgot-password Forgot password request", () => {
    test("Forgot password request", async () => {
      let userDataLocal = { ...userData };
      let requestData = {
        email: userDataLocal.email,
      };
      console.log("Request Data = ", requestData);
      const res = await apiContext.post(`/api/v1/users/forgot-password`, {
        data: requestData,
      });

      const json = await res.json();
      console.log("Response JSON = ", json);

      expect(res.status(), "Verify value of Response Status").toEqual(200);
      expect(
        json.statusCode,
        "Verify value of Status Code in Response"
      ).toEqual(200);
      expect(json.success, "Verify Value of success is true").toEqual(true);
      expect(json, "Verify Data exists in response").toHaveProperty("data");
      expect(json.message, "Verify value of message is Response").toEqual(
        "Password reset mail has been sent on your mail id"
      );
    });
  });
});
