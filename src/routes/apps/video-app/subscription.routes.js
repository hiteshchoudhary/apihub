import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../../../controllers/apps/video-app/subscription.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(
    mongoIdPathVariableValidator("channelId"),
    validate,
    getSubscribedChannels
  )
  .post(
    mongoIdPathVariableValidator("channelId"),
    validate,
    toggleSubscription
  );

router
  .route("/u/:subscriberId")
  .get(
    mongoIdPathVariableValidator("subscriberId"),
    validate,
    getUserChannelSubscribers
  );

export default router;
