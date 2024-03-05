import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

export const URL = `http://localhost:${process.env.PORT || 8080}`;

export const getApiContext = async (playwright) =>
  playwright.request.newContext({
    baseURL: URL,
  });
