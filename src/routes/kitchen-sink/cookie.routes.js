import { Router } from "express";
import {
  getCookies,
  removeCookie,
  setCookie,
} from "../../controllers/kitchen-sink/cookie.controllers.js";
import { cookieKeyQueryStringValidator } from "../../validators/kitchen-sink/cookie.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router.route("/get").get(getCookies);
router.route("/set").post(setCookie);
router
  .route("/remove")
  .delete(cookieKeyQueryStringValidator(), validate, removeCookie);

export default router;
