/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrosswordQuestion } from '../data/puzzleData.js';
import { CheckCircle2, ArrowRight, ArrowDown } from 'lucide-react';

interface QuestionListPanelProps {
  questions: CrosswordQuestion[];
  activeQuestionNumber: number;
  solvedQuestions: Set<number>;
  onSelectQuestion: (questionNumber: number) => void;
}

export const QuestionListPanel: React.FC<QuestionListPanelProps> = ({
  questions,
  activeQuestionNumber,
  solvedQuestions,
  onSelectQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'across' | 'down'>('all');

  const acrossQuestions = questions.filter((q) => q.direction === 'across');
  const downQuestions = questions.filter((q) => q.direction === 'down');

  const filteredQuestions =
    activeTab === 'across'
      ? acrossQuestions
      : activeTab === 'down'
      ? downQuestions
      : questions;

  const acrossSolvedCount = acrossQuestions.filter((q) => solvedQuestions.has(q.number)).length;
  const downSolvedCount = downQuestions.filter((q) => solvedQuestions.has(q.number)).length;

  return (
    <aside className="w-full h-full bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden select-none">
      {/* Category Tabs */}
      <div className="p-2.5 bg-slate-100 border-b border-slate-200 shrink-0">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Daftar Pertanyaan</span>
          <span className="text-emerald-700 font-semibold">
            {solvedQuestions.size} / {questions.length} Selesai
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-200/80 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-1.5 rounded-md transition-all cursor-pointer text-center ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('across')}
            className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'across'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Mendatar ({acrossSolvedCount}/{acrossQuestions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('down')}
            className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'down'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Menurun ({downSolvedCount}/{downQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* Scrollable Questions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-100 focus:outline-hidden">
        {filteredQuestions.map((q) => {
          const isActive = q.number === activeQuestionNumber;
          const isSolved = solvedQuestions.has(q.number);

          return (
            <button
              key={q.number}
              onClick={() => onSelectQuestion(q.number)}
              className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 border ${
                isActive
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                  : isSolved
                  ? 'bg-emerald-50/70 border-emerald-300 hover:bg-emerald-100/50'
                  : 'bg-white border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {/* Question Number Badge */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-extrabold ring-2 ring-amber-300'
                    : isSolved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {q.number}
              </div>

              {/* Question Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm flex items-center gap-0.5 ${
                      q.direction === 'across'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {q.direction === 'across' ? (
                      <>
                        <ArrowRight className="w-2.5 h-2.5" /> Mendatar
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-2.5 h-2.5" /> Menurun
                      </>
                    )}
                    <span className="font-normal opacity-75">({q.length} huruf)</span>
                  </span>

                  {isSolved && (
                    <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Benar</span>
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-snug line-clamp-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : isSolved
                      ? 'text-slate-600'
                      : 'text-slate-700 font-medium'
                  }`}
                >
                  {q.clue}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
