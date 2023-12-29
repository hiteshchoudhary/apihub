import { Router } from "express";
import { responseinspectionController } from "../../controllers/kitchen-sink/index.js";
import { setCacheControlHeaderValidator } from "../../validators/kitchen-sink/responseinspection.validators.js";
import { validate } from "../../validators/validate.js";
import compression from "express-compression";

const router = Router();

router
  .route("/cache/:timeToLive/:cacheResponseDirective")
  .get(
    setCacheControlHeaderValidator(),
    validate,
    responseinspectionController.setCacheControlHeader
  );
router.route("/headers").get(responseinspectionController.getResponseHeaders);
router.route("/html").get(responseinspectionController.sendHTMLTemplate);
router.route("/xml").get(responseinspectionController.sendXMLData);

router
  .use(compression())
  .route("/gzip")
  .get(responseinspectionController.sendGzipResponse);

router
  .use(
    compression({
      brotli: {
        enabled: true,
        zlib: {},
      },
    })
  )
  .get("/brotli", responseinspectionController.sendBrotliResponse);
export default router;
