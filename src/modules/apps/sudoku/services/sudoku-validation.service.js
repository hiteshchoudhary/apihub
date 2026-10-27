import SudokuGenerator from "../engine/SudokuGenerator.js";
import {
  isValidGridStructure,
  createBoardFromGrid,
} from "../utils/sudoku-board.utils.js";

const SIZE = SudokuGenerator.SIZE;

function findConflicts(board) {
  const errors = [];

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const value = board.getCell(row, col).getValue();

      if (value === 0 || board.isSafe(row, col, value)) {
        continue;
      }

      const conflicts = [];
      const conflictTypes = new Set();

      // Check for duplicates in the same row and column.
      for (let index = 0; index < SIZE; index++) {
        if (index !== col && board.getCell(row, index).getValue() === value) {
          conflicts.push({
            row: row + 1,
            col: index + 1,
          });

          conflictTypes.add("row");
        }

        if (index !== row && board.getCell(index, col).getValue() === value) {
          conflicts.push({
            row: index + 1,
            col: col + 1,
          });

          conflictTypes.add("column");
        }
      }

      // Check for duplicates in the same 3×3 box.
      const boxStartRow = Math.floor(row / 3) * 3;
      const boxStartCol = Math.floor(col / 3) * 3;

      for (let r = boxStartRow; r < boxStartRow + 3; r++) {
        for (let c = boxStartCol; c < boxStartCol + 3; c++) {
          if (
            (r !== row || c !== col) &&
            board.getCell(r, c).getValue() === value
          ) {
            conflicts.push({
              row: r + 1,
              col: c + 1,
            });

            conflictTypes.add("box");
          }
        }
      }

      // Remove duplicate cell positions.
      const uniqueConflicts = [
        ...new Map(
          conflicts.map((cell) => [`${cell.row},${cell.col}`, cell])
        ).values(),
      ];

      // Convert conflict types into readable descriptions.
      const locations = {
        row: "the same row",
        column: "the same column",
        box: "the same 3×3 box",
      };

      const conflictLocations = [...conflictTypes].map(
        (type) => locations[type]
      );

      const description =
        conflictLocations.length === 1
          ? conflictLocations[0]
          : `${conflictLocations.slice(0, -1).join(", ")} and ${
              conflictLocations[conflictLocations.length - 1]
            }`;

      const message = `Value ${value} conflicts with another cell in ${description}.`;

      errors.push({
        row: row + 1,
        col: col + 1,
        value,
        conflictsWith: uniqueConflicts,
        message,
      });
    }
  }

  return errors;
}

export function validateSudokuGrid(grid) {
  if (!isValidGridStructure(grid)) {
    const error = new Error(
      "Grid must be a 9x9 array containing integers from 0 to 9."
    );

    error.statusCode = 400;
    throw error;
  }

  const board = createBoardFromGrid(grid);

  const errors = findConflicts(board);
  const valid = board.isValid();

  return {
    valid,
    complete: board.isComplete(),
    errors,
  };
}
