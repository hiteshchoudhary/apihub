import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { bookmarkUnBookmarkPost } from "../../../controllers/apps/social-media/bookmark.controllers.js";
import { postPathVariableValidator } from "../../../validators/apps/social-media/post.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router
  .route("/:postId")
  .post(
    verifyJWT,
    postPathVariableValidator(),
    validate,
    bookmarkUnBookmarkPost
  );

export default router;
