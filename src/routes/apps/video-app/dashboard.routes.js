import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../../../controllers/apps/video-app/dashboard.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT); // Protect all routes with JWT verification

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;
