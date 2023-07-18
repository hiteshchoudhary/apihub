import { Router } from "express";

import {
    getAllExercises,
    addExercise,
    getExerciseById,
    deleteExercise,
    updateExercise
} from "../../../controllers/apps/fitness-tracker/exercise.controller.js";

const router = Router();

router
    .route("/")
    .get(getAllExercises)

router
    .route("/add")
    .post(addExercise)

router
    .route("/:id")
    .get(getExerciseById)
    .delete(deleteExercise)

router
    .route("/update/:id")
    .patch(updateExercise)

export default router;