import { Router } from "express";
import {
  getARandomProduct,
  getProductById,
  getRandomProducts,
} from "../../controllers/public/randomproduct.controllers.js";

const router = Router();

router.route("/").get(getRandomProducts);
router.route("/:productId").get(getProductById);
router.route("/product/random").get(getARandomProduct);

export default router;
