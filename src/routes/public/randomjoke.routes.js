import { Router } from "express";
import {
  getARandomJoke,
  getJokeById,
  getRandomJokes,
} from "../../controllers/public/randomjoke.controllers.js";

const router = Router();

router.route("/").get(getRandomJokes);
router.route("/:jokeId").get(getJokeById);
router.route("/joke/random").get(getARandomJoke);

export default router;
