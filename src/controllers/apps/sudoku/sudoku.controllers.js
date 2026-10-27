import SudokuGenerator from "../../../modules/apps/sudoku/engine/SudokuGenerator.js";

import { generateSudokuPuzzle } from "../../../modules/apps/sudoku/services/sudoku-generation.service.js";
import { validateSudokuGrid } from "../../../modules/apps/sudoku/services/sudoku-validation.service.js";
import { solveSudokuGrid } from "../../../modules/apps/sudoku/services/sudoku-solving.service.js";
import { checkSudokuSolution } from "../../../modules/apps/sudoku/services/sudoku-checking.service.js";
import { checkSudokuUniqueness } from "../../../modules/apps/sudoku/services/sudoku-uniqueness.service.js";

import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const executeSudokuService = (serviceCall) => {
  try {
    return serviceCall();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error.statusCode ?? 500,
      error.message ?? "Sudoku operation failed",
      error.errors ?? []
    );
  }
};

const getSudoku = asyncHandler(async (req, res) => {
  const difficulty =
    req.query.difficulty ?? SudokuGenerator.Difficulty.EXTREMELY_EASY;

  const withSolution = req.query["with-solution"] ?? "false";
  const validDifficulties = Object.values(SudokuGenerator.Difficulty);

  if (!validDifficulties.includes(difficulty)) {
    throw new ApiError(400, "Invalid difficulty.", [
      `Allowed difficulties: ${validDifficulties.join(", ")}`,
    ]);
  }

  if (withSolution !== "true" && withSolution !== "false") {
    throw new ApiError(
      400,
      'Invalid with-solution value. Use "true" or "false".'
    );
  }

  const result = executeSudokuService(() =>
    generateSudokuPuzzle(difficulty, withSolution === "true")
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sudoku puzzle generated successfully"));
});

const getSudokuDifficulties = asyncHandler(async (req, res) => {
  const difficulties = Object.values(SudokuGenerator.Difficulty);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { difficulties },
        "Sudoku difficulties fetched successfully"
      )
    );
});

const validateSudoku = asyncHandler(async (req, res) => {
  const { grid } = req.body ?? {};

  const result = executeSudokuService(() => validateSudokuGrid(grid));

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sudoku grid validated successfully"));
});

const solveSudoku = asyncHandler(async (req, res) => {
  const { grid } = req.body ?? {};

  const result = executeSudokuService(() => solveSudokuGrid(grid));

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sudoku grid processed successfully"));
});

const checkSudoku = asyncHandler(async (req, res) => {
  const { puzzle, solution } = req.body ?? {};

  const result = executeSudokuService(() =>
    checkSudokuSolution(puzzle, solution)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sudoku solution checked successfully"));
});

const checkSudokuUniquenessController = asyncHandler(async (req, res) => {
  const { grid } = req.body ?? {};

  const result = executeSudokuService(() => checkSudokuUniqueness(grid));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Sudoku solution uniqueness checked successfully"
      )
    );
});

export {
  getSudoku,
  getSudokuDifficulties,
  validateSudoku,
  solveSudoku,
  checkSudoku,
  checkSudokuUniquenessController,
};
