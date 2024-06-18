import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
} from "../../../controllers/apps/video-app/like.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/toggle/v/:videoId")
  .post(mongoIdPathVariableValidator("videoId"), validate, toggleVideoLike);
router
  .route("/toggle/c/:commentId")
  .post(mongoIdPathVariableValidator("commentId"), validate, toggleCommentLike);
router
  .route("/toggle/t/:tweetId")
  .post(mongoIdPathVariableValidator("tweetId"), validate, toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
