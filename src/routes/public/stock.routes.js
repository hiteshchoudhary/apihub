import { Router } from "express";
import {
  getARandomStock,
  getStockById,
  getStocks,
} from "../../controllers/public/stock.controllers.js";

const router = Router();

router.route("/").get(getStocks);
router.route("/:stockSymbol").get(getStockById);
router.route("/stock/random").get(getARandomStock);

export default router;
