import {
  isValidGridStructure,
  createBoardFromGrid,
  boardToGrid,
} from "../utils/sudoku-board.utils.js";

export function solveSudokuGrid(grid) {
  // Validate the input grid's structure and values.
  if (!isValidGridStructure(grid)) {
    const error = new Error(
      "Grid must be a 9x9 array containing integers from 0 to 9."
    );

    error.statusCode = 400;
    throw error;
  }

  // Convert the input grid into a Board instance.
  const board = createBoardFromGrid(grid);

  // Reject grids that already violate Sudoku rules.
  if (!board.isValid()) {
    const error = new Error(
      "The grid contains conflicts and cannot be solved as provided."
    );

    error.statusCode = 422;
    throw error;
  }

  // Solve a clone so the original board remains unchanged.
  const solutionBoard = board.clone();
  const solvable = solutionBoard.solveSudoku();

  if (!solvable) {
    return {
      solvable: false,
      solution: null,
    };
  }

  // Convert the solved Board into a plain 9x9 array.
  return {
    solvable: true,
    solution: boardToGrid(solutionBoard),
  };
}
