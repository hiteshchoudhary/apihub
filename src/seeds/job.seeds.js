import { faker } from "@faker-js/faker";
import { Job } from "../models/apps/jobs/job.models.js";
import { User } from "../models/apps/auth/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber } from "../utils/helpers.js";
import {
  AvailableEmploymentTypes,
  AvailableExperienceLevels,
  AvailableWorkModes,
} from "../constants.js";

const JOBS_COUNT = 200;

/**
 * @description Seeding controller for the Jobs API.
 * NOTE: Ensure `seedUsers` middleware is called before this in the route
 * so that we have users available in the database to link as `postedBy`.
 */

const seedJobs = asyncHandler(async (req, res) => {
  // Fetch all users so we can randomly assign job ownership
  const users = await User.find();

  if (users.length === 0) {
    throw new ApiError(
      400,
      "No users found. Please make sure seedUsers middleware is running first."
    );
  }

  // Clear out any old jobs from previous seedings
  await Job.deleteMany({});

  const jobsArray = [];

  for (let i = 0; i < JOBS_COUNT; i++) {
    // Pick a random user to be the recruiter/poster
    const randomUser = users[getRandomNumber(users.length)];

    jobsArray.push({
      title: faker.person.jobTitle(),
      companyName: faker.company.name(),
      companyLogo: faker.image.urlLoremFlickr({ category: "business" }),
      location: `${faker.location.city()}, ${faker.location.stateAbbr()}`,
      salary: `$${faker.number.int({ min: 40, max: 90 })}k - $${faker.number.int({ min: 100, max: 200 })}k`,

      // Use the getRandomNumber helper to pick a random enum from our constants

      workMode: AvailableWorkModes[getRandomNumber(AvailableWorkModes.length)],
      employmentType:
        AvailableEmploymentTypes[
          getRandomNumber(AvailableEmploymentTypes.length)
        ],
      experienceLevel:
        AvailableExperienceLevels[
          getRandomNumber(AvailableExperienceLevels.length)
        ],

      description: faker.lorem.paragraphs(3),
      requirements: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ],
      tags: [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()],
      postedBy: randomUser._id,
    });
  }

  await Job.insertMany(jobsArray);

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, `${JOBS_COUNT} dummy jobs seeded successfully`)
    );
});

export { seedJobs };
