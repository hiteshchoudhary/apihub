import { Router } from "express";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../../../controllers/apps/project-management/task.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createTaskValidator,
  getProjectTasksQueryValidators,
  updateTaskStatusValidator,
  updateTaskValidator,
} from "../../../validators/apps/project-management/task.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/project/:projectId")
  .post(
    mongoIdPathVariableValidator("projectId"),
    createTaskValidator(),
    validate,
    createTask
  )
  .get(
    mongoIdPathVariableValidator("projectId"),
    getProjectTasksQueryValidators(),
    validate,
    getProjectTasks
  );

router
  .route("/:taskId")
  .get(mongoIdPathVariableValidator("taskId"), validate, getTaskById)
  .patch(
    mongoIdPathVariableValidator("taskId"),
    updateTaskValidator(),
    validate,
    updateTask
  )
  .delete(mongoIdPathVariableValidator("taskId"), validate, deleteTask);

router
  .route("/:taskId/status")
  .patch(
    mongoIdPathVariableValidator("taskId"),
    updateTaskStatusValidator(),
    validate,
    updateTaskStatus
  );

export default router;
