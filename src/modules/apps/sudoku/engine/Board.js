import Cell from "./Cell.js";

const SIZE = 9;
const BOX_SIZE = 3;
const EMPTY = 0;

class Board {
  constructor(other = null) {
    if (other !== null && !(other instanceof Board)) {
      throw new TypeError("Expected another Board instance.");
    }

    this.board = other
      ? other.board.map((row) => row.map((cell) => cell.clone()))
      : Array.from({ length: SIZE }, () =>
          Array.from({ length: SIZE }, () => new Cell())
        );
  }

  // Coordinates

  checkRowColumn(row, col) {
    if (
      !Number.isInteger(row) ||
      !Number.isInteger(col) ||
      row < 0 ||
      row >= SIZE ||
      col < 0 ||
      col >= SIZE
    ) {
      throw new RangeError("Row and column must be integers between 0 and 8.");
    }

    return true;
  }

  // Cell access

  getCell(row, col) {
    this.checkRowColumn(row, col);
    return this.board[row][col];
  }

  setCell(row, col, cell) {
    this.checkRowColumn(row, col);

    if (!(cell instanceof Cell)) {
      throw new TypeError("Expected a Cell instance.");
    }

    this.board[row][col] = cell;
  }

  // Board operations

  refreshBoard() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.isFixed()) continue;

        cell.setValue(EMPTY);
        cell.setCertain(false);
        cell.setGuessed(false);
        cell.setWrong(false);
        cell.clearCandidates();
      }
    }
  }

  isEmpty() {
    return this.board.every((row) =>
      row.every((cell) => cell.getValue() === EMPTY)
    );
  }

  printBoard() {
    const lines = this.board.map((row, rowIndex) => {
      const values = row.map((cell) =>
        cell.getValue() === EMPTY ? "_" : cell.getValue()
      );

      const groups = [
        values.slice(0, 3).join(" "),
        values.slice(3, 6).join(" "),
        values.slice(6, 9).join(" "),
      ];

      const line = groups.join(" | ");

      return rowIndex > 0 && rowIndex % BOX_SIZE === 0
        ? `------+-------+------\n${line}`
        : line;
    });

    console.log(lines.join("\n"));
  }

  // Validation

  isSafe(row, col, value) {
    this.checkRowColumn(row, col);

    if (!Number.isInteger(value) || value < 1 || value > SIZE) {
      throw new RangeError("Value must be an integer between 1 and 9.");
    }

    for (let index = 0; index < SIZE; index++) {
      if (index !== col && this.board[row][index].getValue() === value) {
        return false;
      }

      if (index !== row && this.board[index][col].getValue() === value) {
        return false;
      }
    }

    const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

    for (let r = startRow; r < startRow + BOX_SIZE; r++) {
      for (let c = startCol; c < startCol + BOX_SIZE; c++) {
        if ((r !== row || c !== col) && this.board[r][c].getValue() === value) {
          return false;
        }
      }
    }

    return true;
  }

  isCorrect(row, col) {
    this.checkRowColumn(row, col);

    const cell = this.board[row][col];
    const value = cell.getValue();

    if (value === EMPTY) {
      cell.setWrong(false);
      return true;
    }

    const correct = this.isSafe(row, col, value);
    cell.setWrong(!correct);

    return correct;
  }

  isValid() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = this.board[row][col].getValue();

        if (value !== EMPTY && !this.isSafe(row, col, value)) {
          return false;
        }
      }
    }

    return true;
  }

  isComplete() {
    return (
      this.board.every((row) =>
        row.every((cell) => cell.getValue() !== EMPTY)
      ) && this.isValid()
    );
  }

  // Digit utilities

  getNumCount(value) {
    if (!Number.isInteger(value) || value < 1 || value > SIZE) {
      return -1;
    }

    return this.board.reduce(
      (count, row) =>
        count + row.filter((cell) => cell.getValue() === value).length,
      0
    );
  }

  getShuffledDigits() {
    const digits = Array.from({ length: SIZE }, (_, index) => index + 1);

    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    return digits;
  }

  // Solving

  solveSudoku() {
    return this.solve(false);
  }

  solveSudokuRandom() {
    return this.solve(true);
  }

  solve(randomize) {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const cell = this.board[row][col];

        if (cell.getValue() !== EMPTY) continue;

        const digits = randomize
          ? this.getShuffledDigits()
          : Array.from({ length: SIZE }, (_, index) => index + 1);

        for (const value of digits) {
          if (!this.isSafe(row, col, value)) continue;

          cell.setValue(value);

          if (this.solve(randomize)) {
            return true;
          }

          cell.setValue(EMPTY);
        }

        return false;
      }
    }

    return true;
  }

  // Copy

  clone() {
    return new Board(this);
  }
}

export default Board;
