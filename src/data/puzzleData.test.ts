import test from 'node:test';
import assert from 'node:assert/strict';
import { CROSSWORD_QUESTIONS, GRID_ROWS, GRID_COLS } from './puzzleData.js';

test('puzzle has exactly 25 questions', () => {
  assert.equal(CROSSWORD_QUESTIONS.length, 25);
});

test('all words are uppercase A-Z with no spaces or symbols', () => {
  for (const q of CROSSWORD_QUESTIONS) {
    assert.match(q.word, /^[A-Z]+$/);
    assert.equal(q.word.length, q.length);
  }
});

test('all questions stay within grid bounds', () => {
  assert.ok(GRID_ROWS <= 20, `Rows (${GRID_ROWS}) must be <= 20`);
  assert.ok(GRID_COLS <= 20, `Cols (${GRID_COLS}) must be <= 20`);

  for (const q of CROSSWORD_QUESTIONS) {
    assert.ok(q.row >= 0 && q.row < GRID_ROWS, `Question ${q.number} row out of bounds`);
    assert.ok(q.col >= 0 && q.col < GRID_COLS, `Question ${q.number} col out of bounds`);

    if (q.direction === 'across') {
      assert.ok(q.col + q.length <= GRID_COLS, `Question ${q.number} across exceeds cols`);
    } else {
      assert.ok(q.row + q.length <= GRID_ROWS, `Question ${q.number} down exceeds rows`);
    }
  }
});

test('each question has a unique number and starting cell', () => {
  const numbers = new Set<number>();
  const cells = new Set<string>();

  for (const q of CROSSWORD_QUESTIONS) {
    assert.ok(!numbers.has(q.number), `Duplicate number ${q.number}`);
    numbers.add(q.number);

    const cellKey = `${q.row},${q.col}`;
    assert.ok(!cells.has(cellKey), `Duplicate start cell ${cellKey} for question ${q.number}`);
    cells.add(cellKey);
  }

  assert.equal(numbers.size, 25);
  assert.equal(cells.size, 25);
});

test('all intersecting letters between across and down match identically', () => {
  // Build 2D letter map
  const board: (string | null)[][] = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));

  for (const q of CROSSWORD_QUESTIONS) {
    for (let i = 0; i < q.length; i++) {
      const r = q.direction === 'across' ? q.row : q.row + i;
      const c = q.direction === 'across' ? q.col + i : q.col;
      const char = q.word[i];

      if (board[r][c] !== null) {
        assert.equal(board[r][c], char, `Intersection clash at (${r},${c}): expected ${board[r][c]}, got ${char} from question ${q.number}`);
      } else {
        board[r][c] = char;
      }
    }
  }
});

test('crossword forms a single connected graph', () => {
  // Adjacency graph between questions based on shared cells
  const adj: Map<number, Set<number>> = new Map();
  for (const q of CROSSWORD_QUESTIONS) {
    adj.set(q.number, new Set());
  }

  for (let i = 0; i < CROSSWORD_QUESTIONS.length; i++) {
    const q1 = CROSSWORD_QUESTIONS[i];
    for (let j = i + 1; j < CROSSWORD_QUESTIONS.length; j++) {
      const q2 = CROSSWORD_QUESTIONS[j];
      if (q1.direction === q2.direction) continue;

      // Check if they share any cell
      const across = q1.direction === 'across' ? q1 : q2;
      const down = q1.direction === 'across' ? q2 : q1;

      // down intersects across if down.col is within across [col .. col+len-1]
      // and across.row is within down [row .. row+len-1]
      if (
        down.col >= across.col &&
        down.col < across.col + across.length &&
        across.row >= down.row &&
        across.row < down.row + down.length
      ) {
        adj.get(q1.number)!.add(q2.number);
        adj.get(q2.number)!.add(q1.number);
      }
    }
  }

  // BFS from question 1
  const visited = new Set<number>();
  const queue = [CROSSWORD_QUESTIONS[0].number];
  visited.add(CROSSWORD_QUESTIONS[0].number);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const neighbor of adj.get(curr)!) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  assert.equal(visited.size, 25, `All 25 questions must be connected in the puzzle, reached ${visited.size}`);
});
