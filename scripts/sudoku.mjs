export class Sudoku {
  constructor(difficulty = "easy") {
    this.matrix = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.difficulty = difficulty;
    this.solutionMatrix;
  }

  getNextCell(row, col) {
    for (let i = row; i < 9; ++i) {
      for (let j = col; j < 9; ++j) {
        if (this.matrix[i][j] === 0) return [i, j];
      }
      col = 0;
    }
    return [9, 9];
  }

  isCompatible(row, col) {
    for (let i = 0; i < 9; ++i) {
      if (i !== col && this.matrix[row][i] === this.matrix[row][col]) return false;
      if (i !== row && this.matrix[i][col] === this.matrix[row][col]) return false;
    }
    const subSquareRow = parseInt(row / 3) * 3;
    const subSquareCol = parseInt(col / 3) * 3;
    for (let i = subSquareRow; i < subSquareRow + 3; ++i) {
      for (let j = subSquareCol; j < subSquareCol + 3; ++j) {
        if (i === row && j === col) continue;
        if (this.matrix[i][j] === this.matrix[row][col]) return false;
      }
    }
    return true;
  }

  backtrackingSearch(row, col) {
    [row, col] = this.getNextCell(row, col);
    if (row === 9 && col === 9) return true;
    for (let value = 1; value <= 9; ++value) {
      this.matrix[row][col] = value;
      if (this.isCompatible(row, col)) {
        if (this.backtrackingSearch(row, col)) {
          return true;
        }
      }
      this.matrix[row][col] = 0;
    }
    return false;
  }

  removeValues() {
    let cellsToRemove = 0;
    switch (this.difficulty) {
      case "easy":
        cellsToRemove = 35;
        break;
      case "medium":
        cellsToRemove = 45;
        break;
      case "hard":
        cellsToRemove = 55;
        break;
    }

    const solvedCopy = this.matrix.map(row => row.slice());
    const removedCells = new Set();
    while (removedCells.size < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (solvedCopy[row][col] === 0) {
        continue;
      }
  
      removedCells.add(`${row}-${col}`);
      solvedCopy[row][col] = 0;
    }
    this.matrix = solvedCopy;
  }

  generateProblem() {
    this.matrix = null;
    this.solutionMatrix = null;
    this.matrix = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 9; ++i) {
      this.matrix[0][i] = i + 1;
    }
    this.matrix[0].sort((a, b) => 0.5 - Math.random()); // https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
    if (this.backtrackingSearch(1, 0)) {
      this.solutionMatrix = this.matrix.map(row => [...row]);
      this.removeValues();
    }
  }
}
