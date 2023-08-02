import { Router } from "express";
import {
  likeDislikeComment,
  likeDislikePost,
} from "../../../controllers/apps/social-media/like.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/post/:postId")
  .post(verifyJWT, mongoIdPathVariableValidator("postId"), validate, likeDislikePost);

router
  .route("/comment/:commentId")
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("commentId"),
    validate,
    likeDislikeComment
  );

export default router;
