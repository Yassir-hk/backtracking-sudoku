import { Sudoku } from "./sudoku.mjs";

let errorCounter = 0;
const difficultyElement = document.getElementById("difficulty");
const sudokuGridElement = document.getElementById("sudoku-grid");
const generateButton = document.getElementById("generate-button");
const sudoku = new Sudoku();
const currentCell = {
  color: null,
  element: null,
};

function createSudokuCell(row, col, value) {
  const cellElement = document.createElement("span");
  cellElement.id = `${row}-${col}`;
  cellElement.classList.add("cell");
  cellElement.innerHTML = value || "";

  if (col === 2 || col === 5) cellElement.classList.add("col-edge");
  if (row === 2 || row === 5) cellElement.classList.add("row-edge");

  if (value === 0) {
    cellElement.onclick = () => {
      if (currentCell.element) {
        currentCell.element.classList.remove("selected");
        currentCell.element.style.backgroundColor = currentCell.color;
      }
      if (currentCell.element && currentCell.element.id === cellElement.id) return;
      currentCell.color = cellElement.style.backgroundColor;
      currentCell.element = cellElement;
      cellElement.classList.add("selected");
    };
  }

  return cellElement;
}

function drawSudokuGrid(matrix) {
  for (let row = 0; row < 9; ++row) {
    for (let col = 0; col < 9; ++col) {
      const cellElement = createSudokuCell(row, col, matrix[row][col]);
      sudokuGridElement.appendChild(cellElement);
    }
  }
}

function fillSudokuGrid(matrix) {
  for (let row = 0; row < 9; ++row) {
    for (let col = 0; col < 9; ++col) {
      const cellElement = document.getElementById(`${row}-${col}`);
      cellElement.innerHTML = matrix[row][col] || "";
    }
  }
}

function clearSudokuGrid() {
  const sudokuGridCellsElements = sudokuGridElement.childNodes;
  for (const cellElement of sudokuGridCellsElements) {
    cellElement.innerHTML = "";
  }
}

function problemGeneration() {
  clearSudokuGrid();
  sudoku.difficulty = difficultyElement.value;
  sudoku.generateProblem();
  if (sudokuGridElement.hasChildNodes()) {
    fillSudokuGrid(sudoku.matrix);
  } else {
    drawSudokuGrid(sudoku.matrix);
  }
}

document.getElementById("solve-button").addEventListener("click", () => {
  fillSudokuGrid(sudoku.solutionMatrix);
});

window.addEventListener("keydown", (event) => {
  if (currentCell.element === null) return;
  if (event.key >= 1 && event.key <= 9) {
    currentCell.element.innerHTML = event.key;
    const row = parseInt(currentCell.element.id[0]);
    const col = parseInt(currentCell.element.id[2]);
    if (event.key != sudoku.solutionMatrix[row][col]) {
      currentCell.element.classList.remove("selected");
      currentCell.element.classList.add("wrong");
      errorCounter++;
    } 
    if (errorCounter === 3) {
      alert("Game over");
      problemGeneration();
    }
  }
  if (event.key == "Backspace") {
    currentCell.element.innerHTML = "";
    currentCell.element.classList.remove("wrong");
    currentCell.element.classList.add("selected");
  }
});

generateButton.onclick = problemGeneration;
window.onload = problemGeneration;
