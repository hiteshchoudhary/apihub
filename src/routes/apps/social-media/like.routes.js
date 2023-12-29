import { Router } from "express";
import { likeController } from "../../../controllers/apps/social-media/index.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/post/:postId")
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("postId"),
    validate,
    likeController.likeDislikePost
  );

router
  .route("/comment/:commentId")
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("commentId"),
    validate,
    likeController.likeDislikeComment
  );

export default router;
