import { faker } from "@faker-js/faker";
import { Todo } from "../models/apps/todo/todo.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const todos = new Array(10).fill("_").map(() => ({
  title: faker.lorem.sentence({ min: 3, max: 5 }),
  description: faker.lorem.paragraph({
    min: 10,
    max: 15,
  }),
  isComplete: faker.datatype.boolean({}),
}));

const seedTodos = asyncHandler(async (req, res) => {
  await Todo.deleteMany({});

  await Todo.insertMany(todos);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Todos inserted successfully"));
});

export { seedTodos };
