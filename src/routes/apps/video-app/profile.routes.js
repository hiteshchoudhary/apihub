import { Router } from "express";
import {
  getVideoAppChannelProfile,
  updateVideoAppAvatarImage,
  updateVideoAppCoverImage,
  getVideoAppWatchHistory,
  updateVideoAppProfileDetails,
} from "../../../controllers/apps/video-app/profile.controllers.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  updateProfileValidator,
  usernameParamValidator,
} from "../../../validators/apps/video-app/profile.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

//secured routes
router.use(verifyJWT);

router
  .route("/update-account")
  .patch(updateProfileValidator(), validate, updateVideoAppProfileDetails);
router
  .route("/avatar-update")
  .patch(upload.single("avatar"), updateVideoAppAvatarImage);
router
  .route("/cover-image-update")
  .patch(upload.single("coverImage"), updateVideoAppCoverImage);

router.route("/channel-profile/:username").get(getVideoAppChannelProfile);

router.route("/history").get(getVideoAppWatchHistory);

export default router;
