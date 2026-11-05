/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Coins,
  Store,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Clock,
  Award,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  score: number;
  solvedCount: number;
  totalCount: number;
  elapsedSeconds: number;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onWelcomeSpeech: () => void;
  onResetGame: () => void;
  onOpenTeacherPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  solvedCount,
  totalCount,
  elapsedSeconds,
  isVoiceEnabled,
  onToggleVoice,
  onWelcomeSpeech,
  onResetGame,
  onOpenTeacherPanel,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Ignore fullscreen denials in restricted frames
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900 text-white px-4 py-2 border-b-2 border-emerald-500 shadow-md flex items-center justify-between select-none shrink-0 h-16">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg border border-emerald-300/30">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>TANTANGAN TTS EKONOMI</span>
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full shadow-xs">
                SMA
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="text-emerald-400 font-semibold tracking-wide">
              MATERI: PERMINTAAN &amp; PENAWARAN
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              GURU: BU INDAH
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Economics Icons */}
      <div className="hidden 2xl:flex items-center gap-4 text-slate-400/80 text-xs">
        <div className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Konsumen</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
          <Store className="w-3.5 h-3.5 text-blue-400" />
          <span>Produsen</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Mekanisme Pasar</span>
        </div>
      </div>

      {/* HUD Stats & Actions */}
      <div className="flex items-center gap-3">
        {/* Timer */}
        <div className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-inner">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-sm font-bold text-slate-200">
            {formatTime(elapsedSeconds)}
          </span>
        </div>

        {/* Score & Progress Badges */}
        <div className="bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-lg flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <div className="leading-tight">
            <span className="text-[10px] text-emerald-300 block font-semibold uppercase">
              Skor ({solvedCount}/{totalCount})
            </span>
            <span className="text-base font-extrabold text-emerald-300">
              {score} <span className="text-xs text-emerald-400/80 font-normal">/ 100</span>
            </span>
          </div>
        </div>

        {/* Welcome Narration Button */}
        <button
          onClick={onWelcomeSpeech}
          title="Dengarkan Sambutan Bu Indah"
          className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sambutan Bu Indah</span>
        </button>

        {/* Voice Toggle */}
        <button
          onClick={onToggleVoice}
          title={isVoiceEnabled ? 'Matikan Suara Narator' : 'Aktifkan Suara Narator'}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
            isVoiceEnabled
              ? 'bg-blue-600/90 hover:bg-blue-500 text-white border-blue-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-600'
          }`}
        >
          {isVoiceEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span className="hidden md:inline">Suara Aktif</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Suara Bisu</span>
            </>
          )}
        </button>

        {/* Teacher Panel Button */}
        <button
          onClick={onOpenTeacherPanel}
          title="Panel Khusus Guru"
          className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-indigo-400"
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline">Panel Guru</span>
        </button>

        {/* Full Screen Toggle Button */}
        <button
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh (Full Screen)' : 'Mode Layar Penuh (Full Screen IFP)'}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
            isFullscreen
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 hover:text-white'
          }`}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Keluar Penuh</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Layar Penuh</span>
            </>
          )}
        </button>

        {/* Reset / Restart */}
        <button
          onClick={onResetGame}
          title="Ulangi Tantangan dari Awal"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
