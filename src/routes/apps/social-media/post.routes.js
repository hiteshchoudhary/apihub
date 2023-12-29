import { Router } from "express";
import { MAXIMUM_SOCIAL_POST_IMAGE_COUNT } from "../../../constants.js";
import { postController } from "../../../controllers/apps/social-media/index.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  createPostValidator,
  tagPathVariableValidator,
  updatePostValidator,
  usernamePathVariableValidator,
} from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/")
  .get(getLoggedInUserOrIgnore, postController.getAllPosts)
  .post(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    createPostValidator(),
    validate,
    postController.createPost
  );

router.route("/get/my").get(verifyJWT, postController.getMyPosts);

router
  .route("/get/u/:username")
  .get(
    getLoggedInUserOrIgnore,
    usernamePathVariableValidator(),
    validate,
    postController.getPostsByUsername
  );

router
  .route("/get/t/:tag")
  .get(
    getLoggedInUserOrIgnore,
    tagPathVariableValidator(),
    validate,
    postController.getPostsByTag
  );

router
  .route("/:postId")
  .get(
    getLoggedInUserOrIgnore,
    mongoIdPathVariableValidator("postId"),
    validate,
    postController.getPostById
  )
  .patch(
    verifyJWT,
    upload.fields([
      { name: "images", maxCount: MAXIMUM_SOCIAL_POST_IMAGE_COUNT },
    ]),
    mongoIdPathVariableValidator("postId"),
    updatePostValidator(),
    validate,
    postController.updatePost
  )
  .delete(
    verifyJWT,
    mongoIdPathVariableValidator("postId"),
    validate,
    postController.deletePost
  );

router
  .route("/remove/image/:postId/:imageId")
  .patch(
    verifyJWT,
    mongoIdPathVariableValidator("postId"),
    mongoIdPathVariableValidator("imageId"),
    validate,
    postController.removePostImage
  );

export default router;
