import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../../../controllers/apps/video-app/comment.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  addCommentValidator,
  updateCommentValidator,
} from "../../../validators/apps/video-app/comment.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/:videoId")
  .get(mongoIdPathVariableValidator("videoId"), validate, getVideoComments)
  .post(
    mongoIdPathVariableValidator("videoId"),
    addCommentValidator(),
    validate,
    addComment
  );
router
  .route("/c/:commentId")
  .delete(mongoIdPathVariableValidator("commentId"), validate, deleteComment)
  .patch(
    mongoIdPathVariableValidator("commentId"),
    updateCommentValidator(),
    validate,
    updateComment
  );

export default router;
