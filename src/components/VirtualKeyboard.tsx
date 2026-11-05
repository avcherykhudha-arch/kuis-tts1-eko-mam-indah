/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Delete, CheckCircle, Trash2 } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onPrevCell: () => void;
  onNextCell: () => void;
  onClearWord: () => void;
  onCheckAnswer: () => void;
  isWordSolved: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onPrevCell,
  onNextCell,
  onClearWord,
  onCheckAnswer,
  isWordSolved,
}) => {
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div className="w-full p-2 bg-slate-900 border-t border-slate-700/80 flex flex-col gap-1.5 select-none shrink-0">
      {/* Row 1 */}
      <div className="flex justify-center gap-1 w-full">
        {row1.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 max-w-[38px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 text-white font-extrabold text-sm rounded-lg border border-slate-700 shadow-sm transition-all flex items-center justify-center cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 w-full px-2">
        {row2.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 max-w-[38px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 text-white font-extrabold text-sm rounded-lg border border-slate-700 shadow-sm transition-all flex items-center justify-center cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 with Navigation and Backspace */}
      <div className="flex justify-center gap-1 w-full">
        {/* Previous Cell Arrow */}
        <button
          type="button"
          onClick={onPrevCell}
          title="Kotak Sebelumnya (Panah Kiri)"
          className="px-2 h-9 sm:h-10 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 shadow-sm flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {row3.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 max-w-[38px] h-9 sm:h-10 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 text-white font-extrabold text-sm rounded-lg border border-slate-700 shadow-sm transition-all flex items-center justify-center cursor-pointer"
          >
            {char}
          </button>
        ))}

        {/* Next Cell Arrow */}
        <button
          type="button"
          onClick={onNextCell}
          title="Kotak Berikutnya (Panah Kanan)"
          className="px-2 h-9 sm:h-10 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 shadow-sm flex items-center justify-center cursor-pointer transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Backspace Button */}
        <button
          type="button"
          onClick={onBackspace}
          title="Hapus Satu Huruf"
          className="px-2.5 h-9 sm:h-10 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-lg border border-rose-800 shadow-sm flex items-center justify-center cursor-pointer transition-colors"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Row 4: Action Controls */}
      <div className="grid grid-cols-5 gap-1.5 w-full pt-0.5">
        <button
          type="button"
          onClick={onClearWord}
          title="Hapus isian kata saat ini"
          className="col-span-2 h-10 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Hapus Kata</span>
        </button>

        <button
          type="button"
          onClick={onCheckAnswer}
          disabled={isWordSolved}
          className={`col-span-3 h-10 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            isWordSolved
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 cursor-not-allowed opacity-90'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400 active:scale-95 shadow-emerald-950/50'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isWordSolved ? 'SUDAH BENAR' : 'CEK JAWABAN'}</span>
        </button>
      </div>
    </div>
  );
};
