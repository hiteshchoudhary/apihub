import SudokuGenerator from "../engine/SudokuGenerator.js";
import { boardToGrid } from "../utils/sudoku-board.utils.js";

// Calculate metadata from the generated board.
function getPuzzleMetadata(board) {
  let emptyCells = 0;
  let filledCells = 0;
  let fixedCells = 0;

  for (let row = 0; row < SudokuGenerator.SIZE; row++) {
    for (let col = 0; col < SudokuGenerator.SIZE; col++) {
      const cell = board.getCell(row, col);

      if (cell.getValue() === 0) {
        emptyCells++;
      } else {
        filledCells++;
      }

      if (cell.isFixed()) {
        fixedCells++;
      }
    }
  }

  return {
    emptyCells,
    filledCells,
    fixedCells,
  };
}

// Generate a Sudoku puzzle and optionally include its solution.
export function generateSudokuPuzzle(
  difficulty = SudokuGenerator.Difficulty.EXTREMELY_EASY,
  withSolution = false
) {
  // Generate the puzzle using the existing Sudoku engine.
  const puzzleBoard = SudokuGenerator.generate(difficulty);

  if (!puzzleBoard) {
    throw new Error("Failed to generate a Sudoku puzzle.");
  }

  // Build the standard structured response.
  const result = {
    difficulty,
    size: SudokuGenerator.SIZE,
    puzzle: boardToGrid(puzzleBoard),
    metadata: getPuzzleMetadata(puzzleBoard),
  };

  // Return the puzzle when no solution was requested.
  if (!withSolution) {
    return result;
  }

  // Clone the board so the original puzzle remains unchanged.
  const solutionBoard = puzzleBoard.clone();

  // Solve the copied board.
  const solved = solutionBoard.solveSudoku();

  if (!solved) {
    throw new Error("Failed to solve the generated Sudoku puzzle.");
  }

  // Include the solution without modifying the original puzzle.
  result.solution = boardToGrid(solutionBoard);

  return result;
}
