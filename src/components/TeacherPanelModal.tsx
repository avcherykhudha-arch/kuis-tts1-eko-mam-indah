/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrosswordQuestion } from '../data/puzzleData.js';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

interface TeacherPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: CrosswordQuestion[];
  activeQuestion: CrosswordQuestion;
  onUnlockAllQuestions: () => void;
  onUnlockActiveQuestion: () => void;
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  isOpen,
  onClose,
  questions,
  activeQuestion,
  onUnlockAllQuestions,
  onUnlockActiveQuestion,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'answerKey'>('controls');

  if (!isOpen) return null;

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput.trim().toUpperCase() === 'ABCDE') {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Kata sandi salah! Akses ditolak.');
    }
  };

  const handleKeypadTap = (char: string) => {
    if (passwordInput.length < 15) {
      setPasswordInput((prev) => prev + char);
      setErrorMessage('');
    }
  };

  const handleKeypadBackspace = () => {
    setPasswordInput((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleKeypadClear = () => {
    setPasswordInput('');
    setErrorMessage('');
  };

  const QWERTY_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const acrossQuestions = questions.filter((q) => q.direction === 'across');
  const downQuestions = questions.filter((q) => q.direction === 'down');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-4 border-indigo-600 text-left relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
                <span>PANEL KHUSUS GURU</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Bu Indah
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Kontrol instan dan kunci jawaban untuk pengajar di kelas IFP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Password Authentication Screen */
          <div className="py-4 flex flex-col items-center max-w-lg mx-auto w-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 mb-2 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Masukkan Kata Sandi Guru
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Akses ini dilindungi untuk guru pengajar agar kunci jawaban tidak terbuka oleh siswa.
            </p>

            <form onSubmit={handleVerifyPassword} className="w-full space-y-2.5 mb-2">
              <div className="relative max-w-sm mx-auto">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  placeholder="Masukkan kata sandi guru..."
                  autoFocus
                  className="w-full text-center tracking-widest text-lg font-black py-2 px-10 rounded-xl border-2 border-indigo-300 focus:border-indigo-600 focus:outline-hidden bg-slate-50 text-slate-900 uppercase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMessage && (
                <div className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1.5 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* On-screen Touch Keypad for Touchscreen IFP */}
              <div className="pt-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5 text-center">
                  Keyboard Sentuh Layar Smartboard (IFP):
                </p>
                <div className="space-y-1 mb-2">
                  {QWERTY_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                      {row.map((char) => (
                        <button
                          key={char}
                          type="button"
                          onClick={() => handleKeypadTap(char)}
                          className="h-8 min-w-[28px] px-2 rounded-lg bg-white hover:bg-indigo-100 active:bg-indigo-600 active:text-white font-extrabold text-xs text-slate-800 border border-slate-300 shadow-2xs transition-all cursor-pointer flex items-center justify-center"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    className="flex-1 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="flex-1 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    ⌫ Hapus
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Panel Guru</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Teacher Panel */
          <div className="flex-1 overflow-hidden flex flex-col py-3">
            {/* Status & Subtabs */}
            <div className="flex items-center justify-between mb-3 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Guru Terverifikasi (Bu Indah)
                  </span>
                  <span className="text-[11px] text-emerald-700 block">
                    Mode Pengajaran &amp; Evaluasi Aktif
                  </span>
                </div>
              </div>
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-emerald-300 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'controls'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kontrol Papan
                </button>
                <button
                  onClick={() => setActiveTab('answerKey')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'answerKey'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lembar Kunci (25 Soal)
                </button>
              </div>
            </div>

            {activeTab === 'controls' ? (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {/* Instant Unlock All Answers */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Buka Seluruh Jawaban di Papan TTS (Instan)
                      </h4>
                      <p className="text-xs text-indigo-900/80 leading-relaxed mt-1">
                        Secara otomatis mengisi seluruh 25 jawaban benar ke dalam kotak papan TTS,
                        mengunci jawaban, dan memberikan nilai maksimal 100/100.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onUnlockAllQuestions();
                      onClose();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Unlock className="w-4 h-4 text-amber-300" />
                    <span>BUKA SELURUH 25 JAWABAN INSTAN</span>
                  </button>
                </div>

                {/* Instant Unlock Single Active Question */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
                  <div className="mb-2">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      Buka Jawaban Soal Aktif (#{activeQuestion.number})
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Kunci jawaban soal ini: <strong className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-black tracking-wider">{activeQuestion.word}</strong> ({activeQuestion.length} huruf, {activeQuestion.direction === 'across' ? 'Mendatar' : 'Menurun'}).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onUnlockActiveQuestion();
                      onClose();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold py-2 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Buka Jawaban Soal #{activeQuestion.number} Ini Saja</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Complete 25 Questions Answer Key Tab */
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
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
            )}

            {/* Modal Bottom Close */}
            <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Tutup Panel Guru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
