/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrosswordQuestion } from '../data/puzzleData.js';
import { Trophy, Clock, CheckCircle2, RotateCcw, KeyRound, ArrowRight, ArrowDown, X } from 'lucide-react';

interface CompletionModalProps {
  score: number;
  totalQuestions: number;
  solvedCount: number;
  elapsedSeconds: number;
  questions: CrosswordQuestion[];
  onRestartGame: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  score,
  totalQuestions,
  solvedCount,
  elapsedSeconds,
  questions,
  onRestartGame,
}) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} menit ${secs} detik`;
  };

  const acrossQuestions = questions.filter((q) => q.direction === 'across');
  const downQuestions = questions.filter((q) => q.direction === 'down');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-500 text-center relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-600" />

        {!showAnswerKey ? (
          <>
            {/* Trophy Icon */}
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>

            {/* Congratulations Text */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
              LUAR BIASA! SELAMAT!
            </h2>
            <p className="text-sm font-semibold text-emerald-700 mb-6">
              Kalian berhasil menyelesaikan seluruh 25 soal Tantangan TTS Ekonomi bersama Bu Indah!
            </p>

            {/* Score & Time Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block uppercase">
                    Nilai Akhir
                  </span>
                  <span className="text-2xl font-black text-emerald-950 leading-tight">
                    {score} <span className="text-sm font-normal text-emerald-700">/ 100</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 block font-medium">
                    {solvedCount} dari {totalQuestions} Soal Benar
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs text-blue-800 font-semibold block uppercase">
                    Waktu Pengerjaan
                  </span>
                  <span className="text-lg font-black text-blue-950 leading-tight block">
                    {formatTime(elapsedSeconds)}
                  </span>
                  <span className="text-[11px] text-blue-700 block font-medium">
                    Materi Permintaan &amp; Penawaran
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowAnswerKey(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black py-3 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer border border-amber-300"
              >
                <KeyRound className="w-5 h-5 text-slate-950" />
                <span>LIHAT KUNCI JAWABAN</span>
              </button>

              <button
                onClick={onRestartGame}
                className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black py-3 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                <span>MAIN LAGI</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full overflow-hidden text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">
                  KUNCI JAWABAN 25 PERTANYAAN
                </h3>
              </div>
              <button
                onClick={() => setShowAnswerKey(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answer Key Lists (Scrollable inside modal) */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 text-xs">
              {/* Mendatar Answers */}
              <div>
                <h4 className="font-extrabold text-blue-700 flex items-center gap-1.5 uppercase text-xs mb-2">
                  <ArrowRight className="w-4 h-4" />
                  Pertanyaan Mendatar ({acrossQuestions.length} Soal)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {acrossQuestions.map((q) => (
                    <div
                      key={q.number}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">#{q.number}.</span>
                        <span className="font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded tracking-wider">
                          {q.word}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {q.clue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menurun Answers */}
              <div>
                <h4 className="font-extrabold text-emerald-700 flex items-center gap-1.5 uppercase text-xs mb-2">
                  <ArrowDown className="w-4 h-4" />
                  Pertanyaan Menurun ({downQuestions.length} Soal)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {downQuestions.map((q) => (
                    <div
                      key={q.number}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900">#{q.number}.</span>
                        <span className="font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded tracking-wider">
                          {q.word}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {q.clue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex gap-3 justify-end shrink-0">
              <button
                onClick={() => setShowAnswerKey(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Kembali ke Hasil
              </button>
              <button
                onClick={onRestartGame}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Main Lagi Dari Awal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
