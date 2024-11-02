import { Router } from "express";
import {
  getMovies,
  getMovieById,
  getARandomMovie,
} from "../../controllers/public/movies.controllers.js";

const router = Router();

router.route("/").get(getMovies);
router.route("/:movieId").get(getMovieById);
router.route("/movie/random").get(getARandomMovie);

export default router;
