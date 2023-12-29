import { Router } from "express";
import { randomjokeController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(randomjokeController.getRandomJokes);
router.route("/:jokeId").get(randomjokeController.getJokeById);
router.route("/joke/random").get(randomjokeController.getARandomJoke);

export default router;
