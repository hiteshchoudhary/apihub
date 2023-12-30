import { Router } from "express";
import {
  getARandomStock,
  getStockById,
  getStocks,
} from "../../controllers/public/stocks.controllers.js";

const router = Router();

router.route("/").get(getStocks);
router.route("/:stockId").get(getStockById);
router.route("/stock/random").get(getARandomStock);

export default router;
