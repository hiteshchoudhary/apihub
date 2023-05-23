import { Router } from "express";
import {
  getARandomBook,
  getBookById,
  getBooks,
} from "../../controllers/public/book.controllers.js";

const router = Router();

router.route("/").get(getBooks);
router.route("/:bookId").get(getBookById);
router.route("/book/random").get(getARandomBook);

export default router;
