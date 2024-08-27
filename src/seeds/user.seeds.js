import { faker } from "@faker-js/faker";
import fs from "fs";
import { AvailableUserRoles } from "../constants.js";
import logger from "../logger/winston.logger.js";
import { User } from "../models/apps/auth/user.models.js";
import { Cart } from "../models/apps/ecommerce/cart.models.js";
import { EcomProfile } from "../models/apps/ecommerce/profile.models.js";
import { SocialProfile } from "../models/apps/social-media/profile.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber, removeLocalFile } from "../utils/helpers.js";
import { USERS_COUNT } from "./_constants.js";

// Array of fake users
const users = new Array(USERS_COUNT).fill("_").map(() => ({
  avatar: {
    url: faker.internet.avatar(),
    localPath: "",
  },
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isEmailVerified: true,
  role: AvailableUserRoles[getRandomNumber(2)],
}));

/**
 * @description Seeding middleware for users api which other api services can use which are dependent on users
 */
const seedUsers = asyncHandler(async (req, res, next) => {
  const userCount = await User.count();
  if (userCount >= USERS_COUNT) {
    // Don't re-generate the users if we already have them in the database
    next();
    return;
  }
  await User.deleteMany({}); // delete all the existing users from previous seedings
  await SocialProfile.deleteMany({}); // delete dependent model documents as well
  await EcomProfile.deleteMany({}); // delete dependent model documents as well
  await Cart.deleteMany({}); // delete dependent model documents as well
  // remove cred json
  removeLocalFile("./public/temp/seed-credentials.json"); // remove old credentials

  const credentials = [];

  // create Promise array
  const userCreationPromise = users.map(async (user) => {
    credentials.push({
      username: user.username.toLowerCase(),
      password: user.password,
      role: user.role,
    });
    await User.create(user);
  });

  // pass promises array to the Promise.all method
  await Promise.all(userCreationPromise);

  // Once users are created dump the credentials to the json file
  const json = JSON.stringify(credentials);

  fs.writeFileSync(
    "./public/temp/seed-credentials.json",
    json,
    "utf8",
    (err) => {
      logger.error("Error while writing the credentials", err);
    }
  );

  // proceed with the request
  next();
});

/**
 * @description This api gives the saved credentials generated while seeding.
 */
const getGeneratedCredentials = asyncHandler(async (req, res) => {
  try {
    const json = fs.readFileSync("./public/temp/seed-credentials.json", "utf8");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(json),
          "Dummy credentials fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      404,
      "No credentials generated yet. Make sure you have seeded social media or ecommerce api data first which generates users as dependencies."
    );
  }
});

export { getGeneratedCredentials, seedUsers };
