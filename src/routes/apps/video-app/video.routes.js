import { Router } from "express";
import {
  changeUploadThumbnail,
  changeUploadVideo,
  changeVideoDetails,
  deleteVideo,
  getUserVideoById,
  uploadVideo,
  watchVideo,
  togglePublishStatus,
  getAllVideos,
} from "../../../controllers/apps/video-app/video.controller.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

//secured routes
router.use(verifyJWT);

router.route("/result").get(getAllVideos);
router.route("/upload").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router
  .route("/:videoId")
  .get(getUserVideoById)
  .patch(changeVideoDetails)
  .delete(deleteVideo);

router
  .route("/change-upload-video/:videoId")
  .patch(upload.single("videoFile"), changeUploadVideo);
router
  .route("/change-upload-thumbnail/:videoId")
  .patch(upload.single("thumbnail"), changeUploadThumbnail);
router.route("/watch/:videoId").patch(watchVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
