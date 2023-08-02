import { Router } from "express";
import {
  addComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../../../controllers/apps/social-media/comment.controllers.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import {
  commentContentValidator,
} from "../../../validators/apps/social-media/comment.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/post/:postId")
  .get(
    getLoggedInUserOrIgnore,
    mongoIdPathVariableValidator("postId"),
    validate,
    getPostComments
  )
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("postId"),
    commentContentValidator(),
    validate,
    addComment
  );

router
  .route("/:commentId")
  .delete(verifyJWT, mongoIdPathVariableValidator("commentId"), validate, deleteComment)
  .patch(
    verifyJWT,
    mongoIdPathVariableValidator("commentId"),
    commentContentValidator(),
    validate,
    updateComment
  );

export default router;
