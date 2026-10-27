import SudokuGenerator from "../engine/SudokuGenerator.js";
import {
  isValidGridStructure,
  createBoardFromGrid,
} from "../utils/sudoku-board.utils.js";

const SIZE = SudokuGenerator.SIZE;

function findBestEmptyCell(board) {
  let bestCell = null;

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board.getCell(row, col).getValue() !== 0) {
        continue;
      }

      const candidates = [];

      for (let value = 1; value <= SIZE; value++) {
        if (board.isSafe(row, col, value)) {
          candidates.push(value);
        }
      }

      if (candidates.length === 0) {
        return { row, col, candidates };
      }

      if (bestCell === null || candidates.length < bestCell.candidates.length) {
        bestCell = { row, col, candidates };
      }

      if (candidates.length === 1) {
        return bestCell;
      }
    }
  }

  return bestCell;
}

function countSolutions(board, limit = 2) {
  let solutionCount = 0;

  function search() {
    if (solutionCount >= limit) {
      return;
    }

    const emptyCell = findBestEmptyCell(board);

    // No empty cells remain: a complete solution was found.
    if (emptyCell === null) {
      solutionCount++;
      return;
    }

    // An empty cell with no candidates means this path is impossible.
    if (emptyCell.candidates.length === 0) {
      return;
    }

    const { row, col, candidates } = emptyCell;
    const cell = board.getCell(row, col);

    for (const value of candidates) {
      cell.setValue(value);

      search();

      // Restore the board before exploring another candidate.
      cell.setValue(0);

      if (solutionCount >= limit) {
        return;
      }
    }
  }

  search();

  return solutionCount;
}

export function checkSudokuUniqueness(grid) {
  if (!isValidGridStructure(grid)) {
    const error = new Error(
      "Grid must be a 9x9 array containing integers from 0 to 9."
    );

    error.statusCode = 400;
    throw error;
  }

  const board = createBoardFromGrid(grid);

  if (!board.isValid()) {
    const error = new Error(
      "The grid contains conflicts and cannot be solved as provided."
    );

    error.statusCode = 422;
    throw error;
  }

  const solutionCount = countSolutions(board);

  const status =
    solutionCount === 0
      ? "unsolvable"
      : solutionCount === 1
      ? "unique"
      : "multiple";

  return {
    unique: solutionCount === 1,
    solvable: solutionCount > 0,
    status,
    solutionCount,
  };
}
