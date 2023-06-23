import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPostById,
  removePostImage,
  updatePost,
} from "../../../controllers/apps/social-media/post.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  createPostValidator,
  postImagePathVariableValidator,
  postPathVariableValidator,
  updatePostValidator,
} from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";
import { MAXIMUM_SOCIAL_POST_IMAGE_COUNT } from "../../../constants.js";

const router = Router();

router
  .route("/")
  .get(getAllPosts)
  .post(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    createPostValidator(),
    validate,
    createPost
  );

router.route("/my").get(verifyJWT, getMyPosts);

router
  .route("/:postId")
  .get(postPathVariableValidator(), validate, getPostById)
  .patch(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    postPathVariableValidator(),
    updatePostValidator(),
    validate,
    updatePost
  )
  .delete(verifyJWT, postPathVariableValidator(), validate, deletePost);

router
  .route("/:postId/:imageId")
  .patch(
    verifyJWT,
    postPathVariableValidator(),
    postImagePathVariableValidator(),
    validate,
    removePostImage
  );

export default router;
