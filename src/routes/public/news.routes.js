import { Router } from "express";
import {
  getARandomNews,
  getNews,
  getNewsById,
} from "../../controllers/public/news.controllers.js";

const router = Router();

router.route("/").get(getNews);
router.route("/random").get(getARandomNews);
router.route("/:newsId").get(getNewsById);

export default router;
