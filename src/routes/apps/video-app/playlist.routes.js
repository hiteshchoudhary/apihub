import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../../../controllers/apps/video-app/playlist.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createPlaylistValidator,
  updatePlaylistValidator,
} from "../../../validators/apps/video-app/playlist.validators.js";

import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylistValidator(), validate, createPlaylist);

router
  .route("/:playlistId")
  .get(mongoIdPathVariableValidator("playlistId"), validate, getPlaylistById)
  .patch(
    mongoIdPathVariableValidator("playlistId"),
    updatePlaylistValidator(),
    validate,
    updatePlaylist
  )
  .delete(mongoIdPathVariableValidator("playlistId"), validate, deletePlaylist);

router
  .route("/user/:userId")
  .get(mongoIdPathVariableValidator("userId"), validate, getUserPlaylists);
router
  .route("/add/:videoId/:playlistId")
  .patch(
    mongoIdPathVariableValidator("videoId"),
    mongoIdPathVariableValidator("playlistId"),
    validate,
    addVideoToPlaylist
  );
router
  .route("/remove/:videoId/:playlistId")
  .patch(
    mongoIdPathVariableValidator("videoId"),
    mongoIdPathVariableValidator("playlistId"),
    validate,
    removeVideoFromPlaylist
  );

export default router;
