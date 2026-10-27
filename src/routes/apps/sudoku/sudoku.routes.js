import { Router } from "express";

import {
  getSudoku,
  getSudokuDifficulties,
  validateSudoku,
  solveSudoku,
  checkSudoku,
  checkSudokuUniquenessController,
} from "../../../controllers/apps/sudoku/sudoku.controllers.js";

const router = Router();

router.route("/").get(getSudoku);

router.route("/difficulties").get(getSudokuDifficulties);

router.route("/validate").post(validateSudoku);

router.route("/solve").post(solveSudoku);

router.route("/check").post(checkSudoku);

router.route("/unique").post(checkSudokuUniquenessController);

export default router;
