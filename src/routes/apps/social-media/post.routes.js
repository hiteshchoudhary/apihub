import { Router } from "express";
import { createPost } from "../../../controllers/apps/social-media/post.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { createPostValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    upload.fields([{ name: "images", maxCount: 6 }]),
    createPostValidator(),
    validate,
    createPost
  );

export default router;
