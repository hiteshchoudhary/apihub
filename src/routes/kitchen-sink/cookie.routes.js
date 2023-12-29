import { Router } from "express";
import { cookieController } from "../../controllers/kitchen-sink/index.js";
import { cookieKeyQueryStringValidator } from "../../validators/kitchen-sink/cookie.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router.route("/get").get(cookieController.getCookies);
router.route("/set").post(cookieController.setCookie);
router
  .route("/remove")
  .delete(
    cookieKeyQueryStringValidator(),
    validate,
    cookieController.removeCookie
  );

export default router;
