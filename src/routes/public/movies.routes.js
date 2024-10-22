import { Router } from "express";
import {
  getMovies,
  getMovieById,
} from "../../controllers/public/movies.controllers.js";

const router = Router();

router.route("/").get(getMovies);
router.route("/:movieId").get(getMovieById);

export default router;
