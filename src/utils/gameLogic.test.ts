import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialGrid,
  getQuestionCells,
  checkQuestionAnswer,
  calculateProgress,
} from './gameLogic.js';
import { CROSSWORD_QUESTIONS, GRID_ROWS, GRID_COLS } from '../data/puzzleData.js';

test('createInitialGrid creates correct dimensions and links', () => {
  const grid = createInitialGrid();
  assert.equal(grid.length, GRID_ROWS);
  assert.equal(grid[0].length, GRID_COLS);

  // Check that every question's letters are properly loaded
  for (const q of CROSSWORD_QUESTIONS) {
    const cells = getQuestionCells(q);
    assert.equal(cells.length, q.length);
    for (let i = 0; i < q.length; i++) {
      const { row, col } = cells[i];
      assert.equal(grid[row][col].solutionChar, q.word[i]);
    }
  }
});

test('checkQuestionAnswer verifies correct and incorrect words', () => {
  const grid = createInitialGrid();
  const q1 = CROSSWORD_QUESTIONS[0]; // Question 1

  // Initially empty
  const emptyRes = checkQuestionAnswer(q1, grid);
  assert.equal(emptyRes.isCorrect, false);
  assert.equal(emptyRes.currentText, '');

  // Partially fill
  const cells = getQuestionCells(q1);
  grid[cells[0].row][cells[0].col].userChar = q1.word[0];
  const partialRes = checkQuestionAnswer(q1, grid);
  assert.equal(partialRes.isCorrect, false);

  // Completely and correctly fill
  for (let i = 0; i < q1.length; i++) {
    grid[cells[i].row][cells[i].col].userChar = q1.word[i];
  }
  const fullRes = checkQuestionAnswer(q1, grid);
  assert.equal(fullRes.isCorrect, true);
  assert.equal(fullRes.currentText, q1.word);

  // With a typo
  grid[cells[0].row][cells[0].col].userChar = 'Z';
  const typoRes = checkQuestionAnswer(q1, grid);
  assert.equal(typoRes.isCorrect, false);
});

test('calculateProgress properly tracks score and completion', () => {
  const solved = new Set<number>();
  let prog = calculateProgress(solved);
  assert.equal(prog.score, 0);
  assert.equal(prog.percentage, 0);
  assert.equal(prog.isComplete, false);

  // Add 5 solved
  solved.add(1);
  solved.add(2);
  solved.add(3);
  solved.add(4);
  solved.add(5);
  prog = calculateProgress(solved);
  assert.equal(prog.score, 20); // 5 * 4 = 20
  assert.equal(prog.percentage, 20); // 5/25 = 20%
  assert.equal(prog.isComplete, false);

  // Add all 25
  for (let i = 1; i <= 25; i++) {
    solved.add(i);
  }
  prog = calculateProgress(solved);
  assert.equal(prog.score, 100);
  assert.equal(prog.percentage, 100);
  assert.equal(prog.isComplete, true);
  assert.equal(prog.acrossSolved + prog.downSolved, 25);
});
