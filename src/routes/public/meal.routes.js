import { Router } from "express";
import {
  getARandomMeal,
  getMealById,
  getMeals,
} from "../../controllers/public/meal.controllers.js";

const router = Router();

router.route("/").get(getMeals);
router.route("/:mealId").get(getMealById);
router.route("/meal/random").get(getARandomMeal);

export default router;
