import { Router } from "express";
import {
  followUnFollowUser,
  getFollowersListByUserName,
  getFollowingListByUserName,
} from "../../../controllers/apps/social-media/follow.controllers.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { toBeFollowedUserIdValidator } from "../../../validators/apps/social-media/follow.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/:toBeFollowedUserId")
  .post(verifyJWT, toBeFollowedUserIdValidator(), validate, followUnFollowUser);

router
  .route("/list/followers/:username")
  .get(getLoggedInUserOrIgnore, getFollowersListByUserName);

router
  .route("/list/following/:username")
  .get(getLoggedInUserOrIgnore, getFollowingListByUserName);

export default router;
