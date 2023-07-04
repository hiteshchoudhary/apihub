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
  commentPathVariableValidator,
} from "../../../validators/apps/social-media/comment.validators.js";
import { postPathVariableValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/post/:postId")
  .get(
    getLoggedInUserOrIgnore,
    postPathVariableValidator(),
    validate,
    getPostComments
  )
  .post(
    verifyJWT,
    postPathVariableValidator(),
    commentContentValidator(),
    validate,
    addComment
  );

router
  .route("/:commentId")
  .delete(verifyJWT, commentPathVariableValidator(), validate, deleteComment)
  .patch(
    verifyJWT,
    commentPathVariableValidator(),
    commentContentValidator(),
    validate,
    updateComment
  );

export default router;
