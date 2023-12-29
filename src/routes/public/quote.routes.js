import { Router } from "express";
import { quoteController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(quoteController.getQuotes);
router.route("/:quoteId").get(quoteController.getQuoteById);
router.route("/quote/random").get(quoteController.getARandomQuote);

export default router;
