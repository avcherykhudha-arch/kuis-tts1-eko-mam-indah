/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GridCell } from '../utils/gameLogic.js';
import { CrosswordQuestion, GRID_ROWS, GRID_COLS } from '../data/puzzleData.js';

interface CrosswordBoardProps {
  grid: GridCell[][];
  activeQuestion: CrosswordQuestion;
  activeCellCoord: { row: number; col: number };
  solvedQuestions: Set<number>;
  feedbackState: 'none' | 'correct' | 'wrong';
  onCellClick: (row: number, col: number) => void;
}

export const CrosswordBoard: React.FC<CrosswordBoardProps> = ({
  grid,
  activeQuestion,
  activeCellCoord,
  solvedQuestions,
  feedbackState,
  onCellClick,
}) => {
  // Determine if a cell belongs to the active question
  const isCellInActiveQuestion = (r: number, c: number) => {
    return grid[r][c].questions.some((q) => q.number === activeQuestion.number);
  };

  // Determine if a cell is the exact focused cursor
  const isCellFocused = (r: number, c: number) => {
    return activeCellCoord.row === r && activeCellCoord.col === c;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-slate-900/95 overflow-hidden select-none">
      {/* Active Question Bar above Board */}
      <div className="w-full max-w-[620px] mb-2 px-3 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700/80 flex items-center justify-between text-xs shadow-md shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-xs shrink-0">
            #{activeQuestion.number}
          </span>
          <span className="text-slate-300 font-semibold uppercase text-[11px] shrink-0">
            {activeQuestion.direction === 'across' ? 'Mendatar' : 'Menurun'}:
          </span>
          <span className="text-white font-medium truncate" title={activeQuestion.clue}>
            {activeQuestion.clue}
          </span>
        </div>
        <span className="text-amber-300 font-bold text-[11px] shrink-0 ml-2">
          {activeQuestion.length} Huruf
        </span>
      </div>

      {/* The 20x20 Crossword Grid Container */}
      <div className="flex-1 w-full max-h-[calc(100%-48px)] flex items-center justify-center">
        <div
          className={`aspect-square h-full max-h-full max-w-full grid p-1.5 bg-slate-950 rounded-xl shadow-2xl border-2 border-slate-700 transition-all ${
            feedbackState === 'wrong'
              ? 'animate-shake border-rose-500 shadow-rose-950/60'
              : feedbackState === 'correct'
              ? 'border-emerald-400 shadow-emerald-950/60'
              : 'border-slate-700'
          }`}
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
            gap: '1px',
          }}
        >
          {grid.map((rowCells, r) =>
            rowCells.map((cell, c) => {
              const isPlayable = cell.solutionChar !== null;

              if (!isPlayable) {
                // Empty / unused cell
                return (
                  <div
                    key={`${r}-${c}`}
                    className="bg-slate-950 rounded-xs select-none pointer-events-none"
                    aria-hidden="true"
                  />
                );
              }

              const inActiveWord = isCellInActiveQuestion(r, c);
              const isCursor = isCellFocused(r, c);
              const isCellLocked = cell.isLocked;
              const hasStartNumber = cell.isStartOf.length > 0;
              const startNumber = hasStartNumber ? cell.isStartOf[0].number : null;

              // Cell color styling
              let cellBg = 'bg-white text-slate-900';
              let borderColor = 'border-slate-300';

              if (inActiveWord) {
                if (isCursor) {
                  cellBg = 'bg-amber-300 text-slate-950 font-black shadow-inner ring-2 ring-amber-500 z-10';
                  borderColor = 'border-amber-500';
                } else {
                  cellBg = 'bg-amber-100 text-slate-900 font-extrabold';
                  borderColor = 'border-amber-300';
                }
              } else if (isCellLocked) {
                cellBg = 'bg-emerald-100/90 text-emerald-950 font-extrabold';
                borderColor = 'border-emerald-400';
              }

              // Feedback animation
              if (inActiveWord && feedbackState === 'wrong') {
                cellBg = 'bg-rose-200 text-rose-950 animate-pulse font-extrabold';
                borderColor = 'border-rose-400';
              } else if (inActiveWord && feedbackState === 'correct') {
                cellBg = 'bg-emerald-300 text-emerald-950 font-black';
                borderColor = 'border-emerald-500';
              }

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => onCellClick(r, c)}
                  className={`relative w-full h-full flex items-center justify-center border transition-all rounded-xs cursor-pointer select-none ${cellBg} ${borderColor} active:scale-95`}
                  title={
                    cell.questions.length > 0
                      ? `Soal #${cell.questions.map((q) => q.number).join(', ')}`
                      : ''
                  }
                >
                  {/* Start Number in Corner */}
                  {startNumber !== null && (
                    <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[9px] font-black leading-none text-slate-700 pointer-events-none select-none">
                      {startNumber}
                    </span>
                  )}

                  {/* Letter in Cell */}
                  <span className="text-xs sm:text-sm md:text-base font-black uppercase tracking-tight pointer-events-none select-none">
                    {cell.userChar}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
