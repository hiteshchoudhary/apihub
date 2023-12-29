import { Router } from "express";
import { profileController } from "../../../controllers/apps/social-media/index.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  getProfileByUserNameValidator,
  updateSocialProfileValidator,
} from "../../../validators/apps/social-media/profile.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

// public route
router.route("/u/:username").get(
  getLoggedInUserOrIgnore, // hover over the middleware to know more
  getProfileByUserNameValidator(),
  validate,
  profileController.getProfileByUserName
);

router.use(verifyJWT);

router
  .route("/")
  .get(profileController.getMySocialProfile)
  .patch(
    updateSocialProfileValidator(),
    validate,
    profileController.updateSocialProfile
  );

router
  .route("/cover-image")
  .patch(upload.single("coverImage"), profileController.updateCoverImage);

export default router;
