import { Router } from "express";
import { dogController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(dogController.getDogs);
router.route("/:dogId").get(dogController.getDogById);
router.route("/dog/random").get(dogController.getARandomDog);

export default router;
