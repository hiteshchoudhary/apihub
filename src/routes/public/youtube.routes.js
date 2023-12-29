import { Router } from "express";
import { youtubeController } from "../../controllers/public/index.js";

const router = Router();

router.route("/channel").get(youtubeController.getChannelDetails);

router.route("/playlists").get(youtubeController.getPlaylists);
router.route("/playlists/:playlistId").get(youtubeController.getPlaylistById);

router.route("/videos").get(youtubeController.getVideos);
router.route("/videos/:videoId").get(youtubeController.getVideoById);

router.route("/comments/:videoId").get(youtubeController.getVideoComments);
router.route("/related/:videoId").get(youtubeController.getRelatedVideos);

export default router;
