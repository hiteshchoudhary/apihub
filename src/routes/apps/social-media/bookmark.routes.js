import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { bookmarkUnBookmarkPost } from "../../../controllers/apps/social-media/bookmark.controllers.js";
import { postPathVariableValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";
import { getBookMarkedPosts } from "../../../controllers/apps/social-media/post.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getBookMarkedPosts); // getBookMarkedPosts controller is present in posts controller due to utility function dependency

router
  .route("/:postId")
  .post(postPathVariableValidator(), validate, bookmarkUnBookmarkPost);

export default router;
