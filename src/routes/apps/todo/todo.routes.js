import { Router } from "express";

import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  toggleTodoDoneStatus,
  updateTodo,
} from "../../../controllers/apps/todo/todo.controllers.js";
import {
  createTodoValidator,
  getAllTodosQueryValidators,
  todoPathVariableValidator,
  updateTodoValidator,
} from "../../../validators/apps/todo/todo.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/")
  .post(createTodoValidator(), validate, createTodo)
  .get(getAllTodosQueryValidators(), validate, getAllTodos);

router
  .route("/:todoId")
  .get(todoPathVariableValidator(), validate, getTodoById)
  .patch(
    todoPathVariableValidator(),
    updateTodoValidator(),
    validate,
    updateTodo
  )
  .delete(deleteTodo);

router
  .route("/toggle/status/:todoId")
  .patch(todoPathVariableValidator(), validate, toggleTodoDoneStatus);

export default router;
