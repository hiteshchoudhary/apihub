import { Router } from "express";
import { catController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(catController.getCats);
router.route("/:catId").get(catController.getCatById);
router.route("/cat/random").get(catController.getARandomCat);

export default router;
