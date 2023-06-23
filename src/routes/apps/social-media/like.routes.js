import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { postPathVariableValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";
import { likeDislikePost } from "../../../controllers/apps/social-media/like.controllers.js";

const router = Router();

router
  .route("/:postId")
  .post(verifyJWT, postPathVariableValidator(), validate, likeDislikePost);

export default router;
