import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../../../controllers/apps/video-app/tweet.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  addTweetValidator,
  updateTweetValidator,
} from "../../../validators/apps/video-app/tweet.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(addTweetValidator(), validate, createTweet);
router
  .route("/user/:userId")
  .get(mongoIdPathVariableValidator("userId"), validate, getUserTweets);
router
  .route("/:tweetId")
  .patch(
    mongoIdPathVariableValidator("tweetId"),
    updateTweetValidator(),
    validate,
    updateTweet
  )
  .delete(mongoIdPathVariableValidator("tweetId"), validate, deleteTweet);

export default router;
