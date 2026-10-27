import Board from "../engine/Board.js";
import Cell from "../engine/Cell.js";
import SudokuGenerator from "../engine/SudokuGenerator.js";

const SIZE = SudokuGenerator.SIZE;

export function isValidGridStructure(grid) {
  return (
    Array.isArray(grid) &&
    grid.length === SIZE &&
    grid.every(
      (row) =>
        Array.isArray(row) &&
        row.length === SIZE &&
        row.every(
          (value) => Number.isInteger(value) && value >= 0 && value <= SIZE
        )
    )
  );
}

export function createBoardFromGrid(grid) {
  const board = new Board();

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      board.setCell(row, col, new Cell(grid[row][col]));
    }
  }

  return board;
}

export function boardToGrid(board) {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => board.getCell(row, col).getValue())
  );
}
