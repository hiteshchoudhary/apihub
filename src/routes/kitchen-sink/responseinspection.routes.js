import { Router } from "express";
import {
  getResponseHeaders,
  sendHTMLTemplate,
  sendXMLData,
  setCacheControlHeader,
} from "../../controllers/kitchen-sink/responseinspection.controllers.js";
import { setCacheControlHeaderValidator } from "../../validators/kitchen-sink/responseinspection.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router
  .route("/cache/:timeToLive/:cacheResponseDirective")
  .get(setCacheControlHeaderValidator(), validate, setCacheControlHeader);
router.route("/headers").get(getResponseHeaders);
router.route("/html").get(sendHTMLTemplate);
router.route("/xml").get(sendXMLData);

export default router;
