import { Router } from "express";

import { todoController } from "../../../controllers/apps/todo/index.js";
import {
  createTodoValidator,
  getAllTodosQueryValidators,
  updateTodoValidator,
} from "../../../validators/apps/todo/todo.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/")
  .post(createTodoValidator(), validate, todoController.createTodo)
  .get(getAllTodosQueryValidators(), validate, todoController.getAllTodos);

router
  .route("/:todoId")
  .get(
    mongoIdPathVariableValidator("todoId"),
    validate,
    todoController.getTodoById
  )
  .patch(
    mongoIdPathVariableValidator("todoId"),
    updateTodoValidator(),
    validate,
    todoController.updateTodo
  )
  .delete(
    mongoIdPathVariableValidator("todoId"),
    validate,
    todoController.deleteTodo
  );

router
  .route("/toggle/status/:todoId")
  .patch(
    mongoIdPathVariableValidator("todoId"),
    validate,
    todoController.toggleTodoDoneStatus
  );

export default router;
