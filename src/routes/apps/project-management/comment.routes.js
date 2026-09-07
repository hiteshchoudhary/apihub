import { Router } from "express";
import {
  createTaskComment,
  deleteComment,
  getTaskComments,
} from "../../../controllers/apps/project-management/comment.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { createCommentValidator } from "../../../validators/apps/project-management/comment.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/task/:taskId")
  .post(
    mongoIdPathVariableValidator("taskId"),
    createCommentValidator(),
    validate,
    createTaskComment
  )
  .get(
    mongoIdPathVariableValidator("taskId"),
    validate,
    getTaskComments
  );

router
  .route("/:commentId")
  .delete(
    mongoIdPathVariableValidator("commentId"),
    validate,
    deleteComment
  );

export default router;
