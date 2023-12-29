import { Router } from "express";
import { imageController } from "../../controllers/kitchen-sink/index.js";

const router = Router();

router.route("/jpeg").get(imageController.sendJpegImage);
router.route("/jpg").get(imageController.sendJpgImage);
router.route("/png").get(imageController.sendPngImage);
router.route("/svg").get(imageController.sendSvgImage);
router.route("/webp").get(imageController.sendWebpImage);

export default router;
