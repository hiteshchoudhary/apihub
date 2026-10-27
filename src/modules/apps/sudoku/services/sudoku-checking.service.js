import SudokuGenerator from "../engine/SudokuGenerator.js";
import {
  isValidGridStructure,
  createBoardFromGrid,
} from "../utils/sudoku-board.utils.js";

const SIZE = SudokuGenerator.SIZE;

export function checkSudokuSolution(puzzle, solution) {
  if (!isValidGridStructure(puzzle)) {
    const error = new Error(
      "Puzzle must be a 9x9 array containing integers from 0 to 9."
    );

    error.statusCode = 400;
    throw error;
  }

  if (!isValidGridStructure(solution)) {
    const error = new Error(
      "Solution must be a 9x9 array containing integers from 0 to 9."
    );

    error.statusCode = 400;
    throw error;
  }

  const solutionBoard = createBoardFromGrid(solution);
  const errors = [];

  // The submitted solution must be complete.
  if (!solutionBoard.isComplete()) {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (solution[row][col] === 0) {
          errors.push({
            row: row + 1,
            col: col + 1,
            message: "The solution is incomplete.",
          });
        }
      }
    }
  }

  // Check Sudoku rule violations.
  if (!solutionBoard.isValid()) {
    const error = new Error("The submitted solution violates Sudoku rules.");

    error.statusCode = 422;
    throw error;
  }

  // Every original clue must be preserved.
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const puzzleValue = puzzle[row][col];
      const solutionValue = solution[row][col];

      if (puzzleValue !== 0 && puzzleValue !== solutionValue) {
        errors.push({
          row: row + 1,
          col: col + 1,
          message: "The solution does not match the original puzzle.",
        });
      }
    }
  }

  return {
    correct: errors.length === 0,
    errors,
  };
}
