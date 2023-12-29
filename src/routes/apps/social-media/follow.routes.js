import { Router } from "express";
import { followController } from "../../../controllers/apps/social-media/index.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/:toBeFollowedUserId")
  .post(
    verifyJWT,
    mongoIdPathVariableValidator("toBeFollowedUserId"),
    validate,
    followController.followUnFollowUser
  );

router
  .route("/list/followers/:username")
  .get(getLoggedInUserOrIgnore, followController.getFollowersListByUserName);

router
  .route("/list/following/:username")
  .get(getLoggedInUserOrIgnore, followController.getFollowingListByUserName);

export default router;
