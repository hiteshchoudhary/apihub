import { Router } from "express";
import {
  getARandomQuote,
  getQuoteById,
  getQuotes,
} from "../../controllers/public/quote.controllers.js";

const router = Router();

router.route("/").get(getQuotes);
router.route("/:quoteId").get(getQuoteById);
router.route("/quote/random").get(getARandomQuote);

export default router;
