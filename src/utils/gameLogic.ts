/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CROSSWORD_QUESTIONS, CrosswordQuestion, GRID_ROWS, GRID_COLS } from '../data/puzzleData.js';

export interface CellCoord {
  row: number;
  col: number;
}

export interface GridCell {
  row: number;
  col: number;
  solutionChar: string | null;
  userChar: string;
  isStartOf: {
    number: number;
    direction: 'across' | 'down';
  }[];
  questions: {
    number: number;
    indexInWord: number;
  }[];
  isLocked: boolean;
}

export interface GameProgress {
  solvedQuestions: Set<number>;
  score: number;
  totalQuestions: number;
  acrossSolved: number;
  downSolved: number;
  isComplete: boolean;
  percentage: number;
}

/**
 * Initializes empty grid structure from CROSSWORD_QUESTIONS.
 */
export function createInitialGrid(): GridCell[][] {
  const grid: GridCell[][] = Array.from({ length: GRID_ROWS }, (_, r) =>
    Array.from({ length: GRID_COLS }, (_, c) => ({
      row: r,
      col: c,
      solutionChar: null,
      userChar: '',
      isStartOf: [],
      questions: [],
      isLocked: false,
    }))
  );

  for (const q of CROSSWORD_QUESTIONS) {
    // Record starting indicator
    grid[q.row][q.col].isStartOf.push({
      number: q.number,
      direction: q.direction,
    });

    for (let i = 0; i < q.length; i++) {
      const r = q.direction === 'across' ? q.row : q.row + i;
      const c = q.direction === 'across' ? q.col + i : q.col;
      const cell = grid[r][c];

      cell.solutionChar = q.word[i];
      cell.questions.push({
        number: q.number,
        indexInWord: i,
      });
    }
  }

  return grid;
}

/**
 * Gets coordinates of all cells for a specific question.
 */
export function getQuestionCells(q: CrosswordQuestion): CellCoord[] {
  const cells: CellCoord[] = [];
  for (let i = 0; i < q.length; i++) {
    cells.push({
      row: q.direction === 'across' ? q.row : q.row + i,
      col: q.direction === 'across' ? q.col + i : q.col,
    });
  }
  return cells;
}

/**
 * Checks if the current user input for a question matches the solution.
 */
export function checkQuestionAnswer(
  q: CrosswordQuestion,
  grid: GridCell[][]
): { isCorrect: boolean; currentText: string } {
  let currentText = '';
  for (let i = 0; i < q.length; i++) {
    const r = q.direction === 'across' ? q.row : q.row + i;
    const c = q.direction === 'across' ? q.col + i : q.col;
    currentText += (grid[r][c].userChar || '').toUpperCase();
  }
  return {
    isCorrect: currentText === q.word,
    currentText,
  };
}

/**
 * Calculates current game progress.
 */
export function calculateProgress(solvedNumbers: Set<number>): GameProgress {
  const solvedQuestions = new Set(solvedNumbers);
  let acrossSolved = 0;
  let downSolved = 0;

  for (const num of solvedQuestions) {
    const q = CROSSWORD_QUESTIONS.find((item) => item.number === num);
    if (q) {
      if (q.direction === 'across') acrossSolved++;
      else downSolved++;
    }
  }

  const count = solvedQuestions.size;
  const totalQuestions = CROSSWORD_QUESTIONS.length;
  const score = count * 4;
  const isComplete = count === totalQuestions;
  const percentage = Math.round((count / totalQuestions) * 100);

  return {
    solvedQuestions,
    score,
    totalQuestions,
    acrossSolved,
    downSolved,
    isComplete,
    percentage,
  };
}
