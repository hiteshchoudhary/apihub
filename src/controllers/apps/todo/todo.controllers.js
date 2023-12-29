import { Todo } from "../../../models/apps/todo/todo.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const getAllTodos = asyncHandler(async (req, res) => {
  const { query, complete } = req.query;
  const todos = await Todo.aggregate([
    {
      $match:
        query?.length > 0
          ? // return docs if either of the following keys match
            {
              title: {
                $regex: query.trim(),
                $options: "i",
              },
            }
          : {},
    },
    {
      $match: complete
        ? {
            isComplete: JSON.parse(complete), // parse string to boolean. "true" -> true
          }
        : {},
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos fetched successfully"));
});

export const getTodoById = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(404, "Todo does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const todo = await Todo.create({
    title,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { title, description } = req.body;
  const todo = await Todo.findByIdAndUpdate(
    todoId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  );

  if (!todo) {
    throw new ApiError(404, "Todo does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

export const toggleTodoDoneStatus = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new ApiError(404, "Todo does not exist");
  }

  todo.isComplete = !todo.isComplete;
  await todo.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        todo,
        "Todo marked " + todo.isComplete ? "done" : "undone"
      )
    );
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await Todo.findByIdAndDelete(todoId);

  if (!todo) {
    throw new ApiError(404, "Todo does not exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTodo: todo }, "Todo deleted successfully")
    );
});
