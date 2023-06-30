import { faker } from "@faker-js/faker";
import { AvailableUserRoles } from "../constants.js";
import { User } from "../models/apps/auth/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber, removeLocalFile } from "../utils/helpers.js";
import { SocialProfile } from "../models/apps/social-media/profile.models.js";
import { EcomProfile } from "../models/apps/ecommerce/profile.models.js";
import { Cart } from "../models/apps/ecommerce/cart.models.js";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

// TODO: Add comments
// TODO: Do meeting on is this approach good or not
// TODO: Add social media seedings
// TODO: ecommerce order seeding refactor. Now order items are only 1 product but we need multiple products as well in a single order so handle that
// ! TODO: Do we need users seeding? as there is no point generating users if developer is only building Auth system. Can we treat it as a middleware for other api services which require authentication?

const users = new Array(50).fill("_").map(() => ({
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
  await User.deleteMany({});
  await SocialProfile.deleteMany({});
  await EcomProfile.deleteMany({});
  await Cart.deleteMany({});
  // remove cred json if
  removeLocalFile("./public/temp/seed-credentials.json");

  const credentials = [];
  const userCreationPromise = users.map(async (user) => {
    credentials.push({
      username: user.username.toLowerCase(),
      password: user.password,
      role: user.role,
    });
    await User.create(user);
  });

  await Promise.all(userCreationPromise);

  const json = JSON.stringify(credentials);

  fs.writeFileSync(
    "./public/temp/seed-credentials.json",
    json,
    "utf8",
    (err) => {
      console.log("Error while writing the credentials", err);
    }
  );

  next();
});

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
    throw new ApiError(404, "No credentials generated yet");
  }
});

export { seedUsers, getGeneratedCredentials };
