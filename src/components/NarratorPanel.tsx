/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrosswordQuestion } from '../data/puzzleData.js';
import { Volume2, RotateCcw, CheckCircle2, Mic } from 'lucide-react';

interface NarratorPanelProps {
  activeQuestion: CrosswordQuestion;
  isSpeaking: boolean;
  score: number;
  solvedCount: number;
  totalQuestions: number;
  acrossSolved: number;
  acrossTotal: number;
  downSolved: number;
  downTotal: number;
  onReadActiveQuestion: () => void;
  onRepeatAudio: () => void;
}

export const NarratorPanel: React.FC<NarratorPanelProps> = ({
  activeQuestion,
  isSpeaking,
  score,
  solvedCount,
  totalQuestions,
  acrossSolved,
  acrossTotal,
  downSolved,
  downTotal,
  onReadActiveQuestion,
  onRepeatAudio,
}) => {
  const percentage = Math.round((solvedCount / totalQuestions) * 100);

  return (
    <div className="flex flex-col gap-2 p-3 bg-white border-b border-slate-200 select-none">
      {/* Teacher Profile & Narrator Badge */}
      <div className="flex items-center gap-3">
        {/* Animated Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 p-0.5 shadow-md flex items-center justify-center transition-transform ${
              isSpeaking ? 'ring-4 ring-emerald-400 scale-105' : ''
            }`}
          >
            {/* Friendly female teacher vector */}
            <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center relative">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background glow */}
                <circle cx="50" cy="50" r="48" fill="#0f172a" />
                <circle cx="50" cy="40" r="26" fill="#fbcfe8" />
                {/* Hair back */}
                <path
                  d="M26 46C26 26 74 26 74 46C74 58 72 65 72 65L28 65C28 65 26 58 26 46Z"
                  fill="#1e1b4b"
                />
                {/* Face */}
                <ellipse cx="50" cy="45" rx="18" ry="20" fill="#fde047" opacity="0.3" />
                <ellipse cx="50" cy="46" rx="17" ry="19" fill="#fed7aa" />
                {/* Hair front / bangs */}
                <path
                  d="M32 36C36 28 64 28 68 36C62 33 56 34 50 35C44 36 38 33 32 36Z"
                  fill="#1e1b4b"
                />
                {/* Glasses */}
                <rect x="36" y="41" width="11" height="8" rx="3" stroke="#047857" strokeWidth="2" fill="none" />
                <rect x="53" y="41" width="11" height="8" rx="3" stroke="#047857" strokeWidth="2" fill="none" />
                <line x1="47" y1="45" x2="53" y2="45" stroke="#047857" strokeWidth="2" />
                {/* Eyes */}
                <circle cx="41.5" cy="45" r="1.8" fill="#1e293b" />
                <circle cx="58.5" cy="45" r="1.8" fill="#1e293b" />
                {/* Smile */}
                <path
                  d="M44 54C47 58 53 58 56 54"
                  stroke="#b91c1c"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Teacher Blazer / Outfit */}
                <path
                  d="M24 88C24 72 35 68 50 68C65 68 76 72 76 88V100H24V88Z"
                  fill="#065f46"
                />
                <path d="M42 68L50 82L58 68" fill="#ffffff" />
                <path d="M48 82L50 86L52 82" fill="#d97706" />
              </svg>
            </div>
          </div>

          {/* Speaking Audio Wave Pulsing Badge */}
          {isSpeaking && (
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md animate-bounce">
              <Mic className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Narator Ekonomi
            </span>
            {isSpeaking && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Berbicara...
              </span>
            )}
          </div>
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            Bu Indah, S.Pd.
          </h2>
          <p className="text-xs text-slate-500">
            Guru Pengajar Ekonomi SMA
          </p>
        </div>
      </div>

      {/* Speech Clue Bubble */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3 rounded-xl border border-slate-700 shadow-md relative">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-extrabold text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Soal #{activeQuestion.number} ({activeQuestion.direction === 'across' ? 'Mendatar' : 'Menurun'})
          </span>
          <span className="text-[11px] text-slate-300 font-semibold bg-slate-700/80 px-2 py-0.5 rounded">
            {activeQuestion.length} Kotak Huruf
          </span>
        </div>

        <p className="text-sm font-medium leading-snug text-slate-100 mb-2.5">
          "{activeQuestion.clue}"
        </p>

        {/* Read / Repeat Voice Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReadActiveQuestion}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Baca Soal</span>
          </button>
          <button
            onClick={onRepeatAudio}
            className="w-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-bold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Suara</span>
          </button>
        </div>
      </div>

      {/* Progress & Stats Card */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Progres Kuis
          </span>
          <span className="font-extrabold text-emerald-700">
            {solvedCount} / {totalQuestions} ({percentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Split Stats: Mendatar vs Menurun */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-slate-500 block font-medium">Mendatar</span>
            <span className="text-blue-700 font-black text-xs">
              {acrossSolved} / {acrossTotal}
            </span>
          </div>
          <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-slate-500 block font-medium">Menurun</span>
            <span className="text-emerald-700 font-black text-xs">
              {downSolved} / {downTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
