import { Router } from "express";
import {
  changeUploadThumbnail,
  changeUploadVideo,
  changeVideoDetails,
  deleteVideo,
  getVideoById,
  uploadVideo,
  watchVideo,
  togglePublishStatus,
  getAllVideos,
} from "../../../controllers/apps/video-app/video.controllers.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  changeVideoDetailsValidator,
  getVideosValidator,
  uploadVideoValidator,
} from "../../../validators/apps/video-app/video.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

//secured routes
router.use(verifyJWT);

router.route("/result").get(getVideosValidator(), validate, getAllVideos);
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
  uploadVideoValidator(),
  validate,
  uploadVideo
);

router
  .route("/:videoId")
  .get(mongoIdPathVariableValidator("videoId"), validate, getVideoById)
  .patch(
    mongoIdPathVariableValidator("videoId"),
    changeVideoDetailsValidator(),
    validate,
    changeVideoDetails
  )
  .delete(mongoIdPathVariableValidator("videoId"), validate, deleteVideo);

router
  .route("/change-upload-video/:videoId")
  .patch(
    mongoIdPathVariableValidator("videoId"),
    validate,
    upload.single("videoFile"),
    changeUploadVideo
  );
router
  .route("/change-upload-thumbnail/:videoId")
  .patch(
    mongoIdPathVariableValidator("videoId"),
    validate,
    upload.single("thumbnail"),
    changeUploadThumbnail
  );
router
  .route("/watch/:videoId")
  .patch(mongoIdPathVariableValidator("videoId"), validate, watchVideo);
router
  .route("/toggle/publish/:videoId")
  .patch(
    mongoIdPathVariableValidator("videoId"),
    validate,
    togglePublishStatus
  );

export default router;
