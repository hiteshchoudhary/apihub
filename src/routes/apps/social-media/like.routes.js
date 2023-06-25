import { Router } from "express";
import {
  likeDislikeComment,
  likeDislikePost,
} from "../../../controllers/apps/social-media/like.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { commentPathVariableValidator } from "../../../validators/apps/social-media/comment.validators.js";
import { postPathVariableValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/post/:postId")
  .post(verifyJWT, postPathVariableValidator(), validate, likeDislikePost);

router
  .route("/comment/:commentId")
  .post(
    verifyJWT,
    commentPathVariableValidator(),
    validate,
    likeDislikeComment
  );

export default router;
