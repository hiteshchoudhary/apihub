import { faker } from "@faker-js/faker";
import { User } from "../models/apps/auth/user.models.js";
import { ProjectActivity } from "../models/apps/project-management/activity.models.js";
import { ProjectComment } from "../models/apps/project-management/comment.models.js";
import { Milestone } from "../models/apps/project-management/milestone.models.js";
import { Project } from "../models/apps/project-management/project.models.js";
import { Task } from "../models/apps/project-management/task.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber } from "../utils/helpers.js";

const seedProjectManagement = asyncHandler(async (req, res) => {
  await Project.deleteMany({});
  await Task.deleteMany({});
  await Milestone.deleteMany({});
  await ProjectComment.deleteMany({});
  await ProjectActivity.deleteMany({});

  const users = await User.find({});

  if (users.length === 0) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Please seed users first before seeding project management data."
        )
      );
  }

  const projectStatuses = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"];
  const milestoneStatuses = ["UPCOMING", "IN_PROGRESS", "COMPLETED"];

  const projectNames = [
    "E-Commerce Redesign Platform",
    "Mobile Banking Application",
    "AI Customer Support Assistant",
    "Cloud Infrastructure Migration",
    "DevOps CI/CD Automation Pipeline",
  ];

  const projectsToInsert = projectNames.map((name) => {
    const owner = users[getRandomNumber(users.length)];
    const memberUsers = users.slice(0, Math.min(users.length, 4));

    return {
      name,
      description: faker.lorem.paragraph(),
      status: projectStatuses[getRandomNumber(projectStatuses.length)],
      priority: priorities[getRandomNumber(priorities.length)],
      startDate: faker.date.past(),
      dueDate: faker.date.future(),
      owner: owner._id,
      members: memberUsers.map((u) => ({
        user: u._id,
        role: u._id.toString() === owner._id.toString() ? "OWNER" : "MEMBER",
      })),
    };
  });

  const insertedProjects = await Project.insertMany(projectsToInsert);

  const tasksToInsert = [];
  const milestonesToInsert = [];
  const activitiesToInsert = [];

  for (const project of insertedProjects) {
    // Generate 5-8 tasks per project
    const taskCount = faker.number.int({ min: 5, max: 8 });
    for (let i = 0; i < taskCount; i++) {
      const assignee = users[getRandomNumber(users.length)];
      tasksToInsert.push({
        title: faker.hacker.phrase(),
        description: faker.lorem.sentences(2),
        status: taskStatuses[getRandomNumber(taskStatuses.length)],
        priority: priorities[getRandomNumber(priorities.length)],
        project: project._id,
        assignee: assignee._id,
        dueDate: faker.date.future(),
        labels: [faker.hacker.noun(), faker.hacker.adjective()],
      });
    }

    // Generate 2-4 milestones per project
    const milestoneCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < milestoneCount; i++) {
      milestonesToInsert.push({
        name: `Phase ${i + 1}: ${faker.company.catchPhraseNoun()}`,
        description: faker.lorem.sentence(),
        dueDate: faker.date.future(),
        status: milestoneStatuses[getRandomNumber(milestoneStatuses.length)],
        project: project._id,
      });
    }

    // Generate project creation activity
    activitiesToInsert.push({
      user: project.owner,
      action: "CREATED_PROJECT",
      relatedEntity: "Project",
      entityId: project._id,
      project: project._id,
    });
  }

  const insertedTasks = await Task.insertMany(tasksToInsert);
  await Milestone.insertMany(milestonesToInsert);

  // Generate comments for tasks
  const commentsToInsert = [];
  for (const task of insertedTasks.slice(0, 15)) {
    const author = users[getRandomNumber(users.length)];
    commentsToInsert.push({
      content: faker.lorem.sentence(),
      author: author._id,
      task: task._id,
      project: task.project,
    });
  }
  await ProjectComment.insertMany(commentsToInsert);
  await ProjectActivity.insertMany(activitiesToInsert);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "Project Management data seeded successfully"
      )
    );
});

export { seedProjectManagement };
