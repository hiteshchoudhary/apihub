const MIN_VALUE = 0;
const MAX_VALUE = 9;
const MIN_CANDIDATE = 1;

class Cell {
  constructor(value = MIN_VALUE, fixed = false) {
    this.validateValue(value);

    if (typeof fixed !== "boolean") {
      throw new TypeError("Fixed must be a boolean.");
    }

    this.value = value;
    this.fixed = fixed;
    this.certain = false;
    this.guessed = false;
    this.wrong = false;
    this.candidates = new Set();
  }

  validateValue(value) {
    if (!Number.isInteger(value) || value < MIN_VALUE || value > MAX_VALUE) {
      throw new RangeError("Value must be an integer between 0 and 9.");
    }
  }

  validateBoolean(value, name) {
    if (typeof value !== "boolean") {
      throw new TypeError(`${name} must be a boolean.`);
    }
  }

  // Value

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.validateValue(value);

    if (this.fixed) {
      throw new Error("Cannot modify a fixed cell.");
    }

    this.value = value;

    if (value !== MIN_VALUE) {
      this.clearCandidates();
    }
  }

  // Fixed

  isFixed() {
    return this.fixed;
  }

  setFixed(fixed) {
    this.validateBoolean(fixed, "Fixed");

    if (this.fixed && !fixed) {
      throw new Error("Cannot unlock a fixed cell.");
    }

    this.fixed = fixed;
  }

  // Certain

  isCertain() {
    return this.certain;
  }

  setCertain(certain) {
    this.validateBoolean(certain, "Certain");
    this.certain = certain;
  }

  // Guessed

  isGuessed() {
    return this.guessed;
  }

  setGuessed(guessed) {
    this.validateBoolean(guessed, "Guessed");
    this.guessed = guessed;
  }

  // Wrong

  isWrong() {
    return this.wrong;
  }

  setWrong(wrong) {
    this.validateBoolean(wrong, "Wrong");
    this.wrong = wrong;
  }

  // Candidates / Notes

  getCandidates() {
    return new Set(this.candidates);
  }

  getCandidate(index) {
    if (!Number.isInteger(index) || index < 0) {
      return undefined;
    }

    return [...this.candidates][index];
  }

  addCandidate(candidate) {
    if (
      !Number.isInteger(candidate) ||
      candidate < MIN_CANDIDATE ||
      candidate > MAX_VALUE
    ) {
      return false;
    }

    if (this.value !== MIN_VALUE) {
      return false;
    }

    this.candidates.add(candidate);
    return true;
  }

  removeCandidate(candidate) {
    return this.candidates.delete(candidate);
  }

  clearCandidates() {
    this.candidates.clear();
  }

  hasCandidates() {
    return this.candidates.size > 0;
  }

  // Copy

  clone() {
    const cell = new Cell(this.value, this.fixed);

    cell.certain = this.certain;
    cell.guessed = this.guessed;
    cell.wrong = this.wrong;
    cell.candidates = new Set(this.candidates);

    return cell;
  }
}

export default Cell;
