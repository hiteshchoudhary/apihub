import { Router } from "express";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../../controllers/kitchen-sink/httpmethod.controllers.js";

const router = Router();

router.route("/get").get(getRequest);
router.route("/post").post(postRequest);
router.route("/put").put(putRequest);
router.route("/patch").patch(patchRequest);
router.route("/delete").delete(deleteRequest);

export default router;
