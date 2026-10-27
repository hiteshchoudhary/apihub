import Board from "./Board.js";

class SudokuGenerator {
  static SIZE = 9;

  static Difficulty = {
    EXTREMELY_EASY: "EXTREMELY_EASY",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    DIFFICULT: "DIFFICULT",
    EVIL: "EVIL",
  };

  // Step 1:
  // Randomly fill a Sudoku board with 11 values to start.
  static randomFill() {
    let row, col, val;
    let fillCells = 11;

    const board = new Board();

    while (fillCells > 0) {
      row = Math.floor(Math.random() * this.SIZE);
      col = Math.floor(Math.random() * this.SIZE);

      val = Math.floor(Math.random() * this.SIZE) + 1;

      if (board.getCell(row, col).getValue() === 0) {
        while (!board.isSafe(row, col, val)) {
          val = Math.floor(Math.random() * this.SIZE) + 1;
        }

        board.getCell(row, col).setValue(val);
        fillCells--;
      }
    }

    return board;
  }

  // Step 2:
  // We repeatedly create a partially filled board (maxAttempts times
  // if we don't get the result).
  // Then try to solve it randomly.
  // If it solves within the time limit, we return the solved board.
  // Otherwise, we try again until maxAttempts is reached, then throw an error.
  static generateTerminalPattern(maxAttempts, timeLimitMillis) {
    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      const board = this.randomFill();
      const start = Date.now();

      if (board.solveSudokuRandom() && Date.now() - start <= timeLimitMillis) {
        return board;
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts.`);
  }

  // Step 3:
  // Create a list of all 81 cell coordinates [row, col].
  // Shuffle the list randomly using Fisher-Yates.
  // digHoles() follows this random order when deciding which clues to remove.
  static generateCellSequence() {
    const cells = [];

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        cells.push([i, j]);
      }
    }

    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    return cells;
  }

  // Step 4:
  // Choose a random minimum number of clues (fixed/filled values)
  // that the board must have based on its difficulty.
  // Easier puzzles keep more clues, while harder puzzles keep fewer.
  static getRandomTotalGivens(difficulty) {
    switch (difficulty) {
      case this.Difficulty.EXTREMELY_EASY:
        return 40 + Math.floor(Math.random() * 6); // 40–45

      case this.Difficulty.EASY:
        return 34 + Math.floor(Math.random() * 5); // 34–38

      case this.Difficulty.MEDIUM:
        return 30 + Math.floor(Math.random() * 4); // 30–33

      case this.Difficulty.DIFFICULT:
        return 26 + Math.floor(Math.random() * 4); // 26–29

      default:
        return 18 + Math.floor(Math.random() * 5); // 18–22
    }
  }

  // Step 5:
  // Choose a random minimum number of clues that each row and column
  // must have based on its difficulty.
  // Easier puzzles keep more clues, while harder puzzles keep fewer.
  static getRandomRowColGivens(difficulty) {
    let upper;

    switch (difficulty) {
      case this.Difficulty.EXTREMELY_EASY:
        upper = 4;
        break;

      case this.Difficulty.EASY:
        upper = 3;
        break;

      case this.Difficulty.MEDIUM:
        upper = 2;
        break;

      case this.Difficulty.DIFFICULT:
      default:
        upper = 1;
    }

    return Math.floor(Math.random() * upper); // 0 to upper - 1
  }

  // Step 6:
  // Ensure that each row and column has at least the minimum required clues.
  // Also, ensure that the total number of clues meets the selected difficulty.
  static checkRestrictions(board, difficulty) {
    let totalGivens = 0;

    // Random bounds for this puzzle.
    const minTotal = this.getRandomTotalGivens(difficulty);
    const minRowCol = this.getRandomRowColGivens(difficulty);

    for (let i = 0; i < this.SIZE; i++) {
      let rowCount = 0;
      let colCount = 0;

      for (let j = 0; j < this.SIZE; j++) {
        if (board.getCell(i, j).getValue() !== 0) rowCount++;
        if (board.getCell(j, i).getValue() !== 0) colCount++;
      }

      if (rowCount < minRowCol || colCount < minRowCol) {
        return false;
      }

      totalGivens += rowCount;
    }

    return totalGivens >= minTotal;
  }

  // Step 7:
  // Check whether the puzzle still has a unique solution after removing a clue.
  // Try every possible value except the original one in the emptied cell.
  // If another value can also lead to a valid solved Sudoku,
  // the puzzle has multiple solutions, so return false.
  static checkUniqueness(board, row, col, originalVal) {
    for (let i = 1; i <= 9; i++) {
      if (i === originalVal) continue;
      if (!board.isSafe(row, col, i)) continue;

      const copy = new Board(board);

      copy.getCell(row, col).setValue(i);

      if (copy.solveSudoku()) {
        return false;
      }
    }

    return true;
  }

  // Step 8:
  // Generate a fully solved Sudoku board.
  // Mark all cells as initially removable.
  // Get a random order for testing cell removals.
  // Try removing each clue one by one.
  // If removing a clue breaks the difficulty restrictions or uniqueness,
  // restore it and mark that cell as non-removable.
  // Otherwise, keep the cell empty.
  // Finally, return the resulting Sudoku puzzle.
  static digHoles(difficulty) {
    const board = this.generateTerminalPattern(1000, 100);

    const canBeDug = Array.from({ length: this.SIZE }, () =>
      Array(this.SIZE).fill(true)
    );

    const cellSequence = this.generateCellSequence();

    for (const [r, c] of cellSequence) {
      if (!canBeDug[r][c]) continue;

      const temp = board.getCell(r, c).getValue();

      board.getCell(r, c).setValue(0);

      if (
        !this.checkRestrictions(board, difficulty) ||
        !this.checkUniqueness(board, r, c, temp)
      ) {
        board.getCell(r, c).setValue(temp);
        canBeDug[r][c] = false; // Prune
      }
    }

    return board;
  }

  // Step 9 - Final:
  // Try to generate a puzzle for up to 1 second.
  // Call digHoles() to create the puzzle.
  // Mark all remaining numbers as fixed clues.
  // Return the Sudoku puzzle or null if generation fails within the time limit.

  static generate(difficulty) {
    const timeLimit = 5000; // Maximum generation time: 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < timeLimit) {
      let board;

      try {
        board = this.digHoles(difficulty);
      } catch (error) {
        // If an attempt fails, try generating a new puzzle.
        continue;
      }

      if (!board) continue;

      // Mark remaining clues as fixed.
      for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < this.SIZE; j++) {
          if (board.getCell(i, j).getValue() !== 0) {
            board.getCell(i, j).setFixed(true);
          }
        }
      }

      return board;
    }

    console.error("Failed to generate a Sudoku puzzle within 5 seconds.");
    return null;
  }
}

export default SudokuGenerator;
