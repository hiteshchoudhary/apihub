import { Router } from "express";
import { followUnFollowUser } from "../../../controllers/apps/social-media/follow.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { toBeFollowedUserIdValidator } from "../../../validators/apps/social-media/follow.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/:toBeFollowedUserId")
  .post(verifyJWT, toBeFollowedUserIdValidator(), validate, followUnFollowUser);

export default router;
