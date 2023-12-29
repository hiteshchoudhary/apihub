import { Router } from "express";
import { commentController } from "../../../controllers/apps/social-media/index.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { commentContentValidator } from "../../../validators/apps/social-media/comment.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/post/:postId")
  .get(
    getLoggedInUserOrIgnore,
    mongoIdPathVariableValidator("postId"),
    validate,
    commentController.getPostComments
  )
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("postId"),
    commentContentValidator(),
    validate,
    commentController.addComment
  );

router
  .route("/:commentId")
  .delete(
    verifyJWT,
    mongoIdPathVariableValidator("commentId"),
    validate,
    commentController.deleteComment
  )
  .patch(
    verifyJWT,
    mongoIdPathVariableValidator("commentId"),
    commentContentValidator(),
    validate,
    commentController.updateComment
  );

export default router;
