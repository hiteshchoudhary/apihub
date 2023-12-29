import { Router } from "express";
import { httpmethodController } from "../../controllers/kitchen-sink/index.js";

const router = Router();

router.route("/get").get(httpmethodController.getRequest);
router.route("/post").post(httpmethodController.postRequest);
router.route("/put").put(httpmethodController.putRequest);
router.route("/patch").patch(httpmethodController.patchRequest);
router.route("/delete").delete(httpmethodController.deleteRequest);

export default router;
