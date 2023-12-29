import { Router } from "express";
import { mealController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(mealController.getMeals);
router.route("/:mealId").get(mealController.getMealById);
router.route("/meal/random").get(mealController.getARandomMeal);

export default router;
