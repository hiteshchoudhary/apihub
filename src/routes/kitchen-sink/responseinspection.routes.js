import { Router } from "express";
import {
  getResponseHeaders,
  sendBrotliResponse,
  sendGzipResponse,
  sendHTMLTemplate,
  sendXMLData,
  setCacheControlHeader,
} from "../../controllers/kitchen-sink/responseinspection.controllers.js";
import { setCacheControlHeaderValidator } from "../../validators/kitchen-sink/responseinspection.validators.js";
import { validate } from "../../validators/validate.js";
import compression from "express-compression";

const router = Router();

router
  .route("/cache/:timeToLive/:cacheResponseDirective")
  .get(setCacheControlHeaderValidator(), validate, setCacheControlHeader);
router.route("/headers").get(getResponseHeaders);
router.route("/html").get(sendHTMLTemplate);
router.route("/xml").get(sendXMLData);

router.use(compression()).route("/gzip").get(sendGzipResponse);

router
  .use(
    compression({
      brotli: {
        enabled: true,
        zlib: {},
      },
    })
  )
  .get("/brotli", sendBrotliResponse);
export default router;
