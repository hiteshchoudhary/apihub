import { Router } from "express";
import { randomproductController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(randomproductController.getRandomProducts);
router.route("/:productId").get(randomproductController.getProductById);
router.route("/product/random").get(randomproductController.getARandomProduct);

export default router;
