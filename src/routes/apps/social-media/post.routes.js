import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
} from "../../../controllers/apps/social-media/post.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  createPostValidator,
  postPathVariableValidator,
} from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/")
  .get(getAllPosts)
  .post(
    verifyJWT,
    upload.fields([{ name: "images", maxCount: 6 }]),
    createPostValidator(),
    validate,
    createPost
  );

router
  .route("/:postId")
  .get(postPathVariableValidator(), validate, getPostById)
  .delete(verifyJWT, postPathVariableValidator(), validate, deletePost);

export default router;
