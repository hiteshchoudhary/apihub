import { Router } from "express";
import { bookController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(bookController.getBooks);
router.route("/:bookId").get(bookController.getBookById);
router.route("/book/random").get(bookController.getARandomBook);

export default router;
