import { Router } from "express";
import {
  getChannelDetails,
  getRelatedVideos,
  getVideoById,
  getVideoComments,
  getVideos,
} from "../../controllers/public/youtube.controllers.js";

const router = Router();

router.route("/channel").get(getChannelDetails);
router.route("/videos").get(getVideos);
router.route("/videos/:videoId").get(getVideoById);
router.route("/comments/:videoId").get(getVideoComments);
router.route("/related/:videoId").get(getRelatedVideos);

export default router;
