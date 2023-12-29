import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  bookmarkController,
  postController,
} from "../../../controllers/apps/social-media/index.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(postController.getBookMarkedPosts); // getBookMarkedPosts controller is present in posts controller due to utility function dependency

router
  .route("/:postId")
  .post(
    mongoIdPathVariableValidator("postId"),
    validate,
    bookmarkController.bookmarkUnBookmarkPost
  );

export default router;
