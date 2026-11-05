/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CROSSWORD_QUESTIONS, CrosswordQuestion } from './data/puzzleData.js';
import {
  createInitialGrid,
  getQuestionCells,
  checkQuestionAnswer,
  calculateProgress,
  GridCell,
} from './utils/gameLogic.js';
import {
  narrator,
  playKeySound,
  playSuccessSound,
  playErrorSound,
  playFanfareSound,
} from './utils/audio.js';
import { Header } from './components/Header.tsx';
import { QuestionListPanel } from './components/QuestionListPanel.tsx';
import { CrosswordBoard } from './components/CrosswordBoard.tsx';
import { NarratorPanel } from './components/NarratorPanel.tsx';
import { VirtualKeyboard } from './components/VirtualKeyboard.tsx';
import { CompletionModal } from './components/CompletionModal.tsx';
import { TeacherPanelModal } from './components/TeacherPanelModal.tsx';

export default function App() {
  const isDemoComplete = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo_complete') === '1';

  const [grid, setGrid] = useState<GridCell[][]>(() => {
    const initial = createInitialGrid();
    if (isDemoComplete) {
      for (const q of CROSSWORD_QUESTIONS) {
        for (let i = 0; i < q.length; i++) {
          const r = q.direction === 'across' ? q.row : q.row + i;
          const c = q.direction === 'across' ? q.col + i : q.col;
          initial[r][c].userChar = q.word[i];
          initial[r][c].isLocked = true;
        }
      }
    }
    return initial;
  });
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number>(1);
  const [activeCellIndex, setActiveCellIndex] = useState<number>(0);
  const [solvedQuestions, setSolvedQuestions] = useState<Set<number>>(() => {
    if (isDemoComplete) {
      return new Set(CROSSWORD_QUESTIONS.map((q) => q.number));
    }
    return new Set();
  });
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(isDemoComplete ? 285 : 0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(isDemoComplete);
  const [showTeacherPanelModal, setShowTeacherPanelModal] = useState<boolean>(false);

  const activeQuestion = useMemo(() => {
    return (
      CROSSWORD_QUESTIONS.find((q) => q.number === activeQuestionNumber) ||
      CROSSWORD_QUESTIONS[0]
    );
  }, [activeQuestionNumber]);

  const activeQuestionCells = useMemo(() => {
    return getQuestionCells(activeQuestion);
  }, [activeQuestion]);

  const activeCellCoord = useMemo(() => {
    if (activeQuestionCells[activeCellIndex]) {
      return activeQuestionCells[activeCellIndex];
    }
    return activeQuestionCells[0] || { row: 0, col: 0 };
  }, [activeQuestionCells, activeCellIndex]);

  const progress = useMemo(() => {
    return calculateProgress(solvedQuestions);
  }, [solvedQuestions]);

  const acrossTotal = useMemo(
    () => CROSSWORD_QUESTIONS.filter((q) => q.direction === 'across').length,
    []
  );
  const downTotal = useMemo(
    () => CROSSWORD_QUESTIONS.filter((q) => q.direction === 'down').length,
    []
  );

  // Timer interval (runs while game is not complete)
  useEffect(() => {
    if (progress.isComplete) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [progress.isComplete]);

  // Keep speech speaking state synced
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(narrator.getIsSpeaking());
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Voice narration helper
  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceEnabled) return;
      narrator.speak(text, () => {
        setIsSpeaking(false);
      });
      setIsSpeaking(true);
    },
    [isVoiceEnabled]
  );

  // Welcome speech by Bu Indah
  const handleWelcomeSpeech = useCallback(() => {
    const welcome =
      'Halo anak-anak! Selamat datang di Tantangan Teka-Teki Silang Ekonomi bersama Bu Indah. Hari ini kita akan menguji pemahaman kalian tentang materi permintaan dan penawaran. Pilih nomor soal mana saja yang ingin kalian kerjakan, tidak harus berurutan. Selamat belajar dan tetap semangat!';
    speakText(welcome);
  }, [speakText]);

  // Read current active question clue
  const handleReadActiveQuestion = useCallback(() => {
    const dirText = activeQuestion.direction === 'across' ? 'mendatar' : 'menurun';
    const text = `Pertanyaan ${dirText} nomor ${activeQuestion.number}. Petunjuk: ${activeQuestion.clue}. Terdiri dari ${activeQuestion.length} huruf.`;
    speakText(text);
  }, [activeQuestion, speakText]);

  // Select a question
  const handleSelectQuestion = useCallback(
    (questionNumber: number, targetCellIndex?: number) => {
      setActiveQuestionNumber(questionNumber);
      const nextQ = CROSSWORD_QUESTIONS.find((q) => q.number === questionNumber);
      if (nextQ) {
        if (typeof targetCellIndex === 'number' && targetCellIndex >= 0 && targetCellIndex < nextQ.length) {
          setActiveCellIndex(targetCellIndex);
        } else {
          setActiveCellIndex(0);
        }

        // Voice speak clue
        const dirText = nextQ.direction === 'across' ? 'mendatar' : 'menurun';
        speakText(
          `Pertanyaan ${dirText} nomor ${nextQ.number}. ${nextQ.clue}.`
        );
      }
    },
    [speakText]
  );

  // Cell click on the board
  const handleCellClick = useCallback(
    (r: number, c: number) => {
      const cell = grid[r][c];
      if (cell.questions.length === 0) return;

      // Check if clicked cell is part of the currently active question
      const currentIndexInActive = cell.questions.find(
        (q) => q.number === activeQuestionNumber
      );

      if (currentIndexInActive) {
        // If cell is already in active question:
        // If cell also belongs to another question, toggle to the other question if double-clicked or re-clicked!
        if (
          activeCellIndex === currentIndexInActive.indexInWord &&
          cell.questions.length > 1
        ) {
          const otherQ = cell.questions.find(
            (q) => q.number !== activeQuestionNumber
          );
          if (otherQ) {
            handleSelectQuestion(otherQ.number, otherQ.indexInWord);
            return;
          }
        }
        setActiveCellIndex(currentIndexInActive.indexInWord);
      } else {
        // Switch to the first question that uses this cell
        const firstQ = cell.questions[0];
        handleSelectQuestion(firstQ.number, firstQ.indexInWord);
      }
    },
    [grid, activeQuestionNumber, activeCellIndex, handleSelectQuestion]
  );

  // Navigate to previous cell in current word
  const handlePrevCell = useCallback(() => {
    setActiveCellIndex((prev) => (prev > 0 ? prev - 1 : activeQuestion.length - 1));
  }, [activeQuestion.length]);

  // Navigate to next cell in current word
  const handleNextCell = useCallback(() => {
    setActiveCellIndex((prev) => (prev < activeQuestion.length - 1 ? prev + 1 : 0));
  }, [activeQuestion.length]);

  // Input a character
  const handleKeyPress = useCallback(
    (char: string) => {
      const upperChar = char.toUpperCase();
      if (!/^[A-Z]$/.test(upperChar)) return;

      playKeySound();

      const coord = activeQuestionCells[activeCellIndex];
      if (!coord) return;

      const currentCell = grid[coord.row][coord.col];

      // If cell is locked by an already solved question, skip edit
      if (currentCell.isLocked && solvedQuestions.has(activeQuestion.number)) {
        handleNextCell();
        return;
      }

      // Update grid
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
        newGrid[coord.row][coord.col].userChar = upperChar;
        return newGrid;
      });

      // Auto advance to next cell in the word
      if (activeCellIndex < activeQuestion.length - 1) {
        setActiveCellIndex((prev) => prev + 1);
      }
    },
    [activeQuestionCells, activeCellIndex, grid, activeQuestion.length, activeQuestion.number, solvedQuestions, handleNextCell]
  );

  // Backspace key
  const handleBackspace = useCallback(() => {
    playKeySound();
    const coord = activeQuestionCells[activeCellIndex];
    if (!coord) return;

    const currentCell = grid[coord.row][coord.col];

    // If current cell has a letter and isn't locked, clear it
    if (currentCell.userChar !== '' && !currentCell.isLocked) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
        newGrid[coord.row][coord.col].userChar = '';
        return newGrid;
      });
    } else if (activeCellIndex > 0) {
      // Move to previous cell and clear it if unlocked
      const prevCoord = activeQuestionCells[activeCellIndex - 1];
      setActiveCellIndex((prev) => prev - 1);
      if (prevCoord && !grid[prevCoord.row][prevCoord.col].isLocked) {
        setGrid((prevGrid) => {
          const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
          newGrid[prevCoord.row][prevCoord.col].userChar = '';
          return newGrid;
        });
      }
    }
  }, [activeQuestionCells, activeCellIndex, grid]);

  // Clear current unanswered word
  const handleClearWord = useCallback(() => {
    if (solvedQuestions.has(activeQuestion.number)) return;
    playKeySound();
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      for (const cellCoord of activeQuestionCells) {
        const cell = newGrid[cellCoord.row][cellCoord.col];
        if (!cell.isLocked) {
          cell.userChar = '';
        }
      }
      return newGrid;
    });
    setActiveCellIndex(0);
  }, [activeQuestion.number, activeQuestionCells, solvedQuestions]);

  // Check Answer
  const handleCheckAnswer = useCallback(() => {
    if (solvedQuestions.has(activeQuestion.number)) return;

    const result = checkQuestionAnswer(activeQuestion, grid);

    if (result.isCorrect) {
      // Correct!
      playSuccessSound();
      setFeedbackState('correct');
      setTimeout(() => setFeedbackState('none'), 1200);

      // Lock correct cells
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
        for (const coord of activeQuestionCells) {
          newGrid[coord.row][coord.col].isLocked = true;
        }
        return newGrid;
      });

      const newSolved = new Set(solvedQuestions);
      newSolved.add(activeQuestion.number);
      setSolvedQuestions(newSolved);

      const remaining = CROSSWORD_QUESTIONS.length - newSolved.size;

      if (remaining === 0) {
        // Complete!
        playFanfareSound();
        speakText(
          'Luar biasa anak-anak! Seluruh dua puluh lima soal berhasil kalian selesaikan dengan nilai sempurna seratus! Kerja kelompok yang sangat hebat!'
        );
        setShowCompletionModal(true);
      } else {
        const compliments = [
          'Hebat! Jawaban kamu benar!',
          'Luar biasa! Jawaban kamu tepat sekali!',
          'Mantap! Jawaban benar, ayo lanjutkan ke soal berikutnya!',
          'Keren! Pemahaman ekonomi kalian sangat baik!',
        ];
        const compliment = compliments[newSolved.size % compliments.length];
        speakText(compliment);

        // Find next unsolved question
        const nextUnsolved = CROSSWORD_QUESTIONS.find(
          (q) => !newSolved.has(q.number)
        );
        if (nextUnsolved) {
          setTimeout(() => {
            handleSelectQuestion(nextUnsolved.number);
          }, 800);
        }
      }
    } else {
      // Wrong!
      playErrorSound();
      setFeedbackState('wrong');
      setTimeout(() => setFeedbackState('none'), 1200);
      speakText('Maaf, jawaban belum tepat. Silakan coba periksa kembali!');
    }
  }, [activeQuestion, activeQuestionCells, grid, solvedQuestions, speakText, handleSelectQuestion]);

  // Voice toggle
  const handleToggleVoice = useCallback(() => {
    setIsVoiceEnabled((prev) => {
      const next = !prev;
      narrator.setEnabled(next);
      return next;
    });
  }, []);

  // Reset / Restart
  const handleResetGame = useCallback(() => {
    narrator.stop();
    setGrid(createInitialGrid());
    setActiveQuestionNumber(1);
    setActiveCellIndex(0);
    setSolvedQuestions(new Set());
    setFeedbackState('none');
    setElapsedSeconds(0);
    setShowCompletionModal(false);
  }, []);

  // Teacher Panel: Unlock all 25 questions instantly
  const handleUnlockAllQuestions = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      for (const q of CROSSWORD_QUESTIONS) {
        for (let i = 0; i < q.length; i++) {
          const r = q.direction === 'across' ? q.row : q.row + i;
          const c = q.direction === 'across' ? q.col + i : q.col;
          newGrid[r][c].userChar = q.word[i];
          newGrid[r][c].isLocked = true;
        }
      }
      return newGrid;
    });

    const allSolved = new Set(CROSSWORD_QUESTIONS.map((q) => q.number));
    setSolvedQuestions(allSolved);
    playFanfareSound();
    speakText('Kunci jawaban seluruh soal telah dibuka oleh Bu Indah.');
    setShowCompletionModal(true);
  }, [speakText]);

  // Teacher Panel: Unlock single active question
  const handleUnlockActiveQuestion = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      for (let i = 0; i < activeQuestion.length; i++) {
        const r = activeQuestion.direction === 'across' ? activeQuestion.row : activeQuestion.row + i;
        const c = activeQuestion.direction === 'across' ? activeQuestion.col + i : activeQuestion.col;
        newGrid[r][c].userChar = activeQuestion.word[i];
        newGrid[r][c].isLocked = true;
      }
      return newGrid;
    });

    setSolvedQuestions((prev) => {
      const next = new Set(prev);
      next.add(activeQuestion.number);
      if (next.size === CROSSWORD_QUESTIONS.length) {
        setShowCompletionModal(true);
      }
      return next;
    });
    playSuccessSound();
    speakText(`Jawaban nomor ${activeQuestion.number} telah dibuka.`);
  }, [activeQuestion, speakText]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCompletionModal || showTeacherPanelModal) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevCell();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextCell();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCheckAnswer();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showCompletionModal,
    showTeacherPanelModal,
    handleBackspace,
    handlePrevCell,
    handleNextCell,
    handleCheckAnswer,
    handleKeyPress,
  ]);

  const isWordSolved = solvedQuestions.has(activeQuestion.number);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-900 font-sans select-none">
      {/* 1. Header (Fixed 64px) */}
      <Header
        score={progress.score}
        solvedCount={progress.solvedQuestions.size}
        totalCount={progress.totalQuestions}
        elapsedSeconds={elapsedSeconds}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={handleToggleVoice}
        onWelcomeSpeech={handleWelcomeSpeech}
        onResetGame={handleResetGame}
        onOpenTeacherPanel={() => setShowTeacherPanelModal(true)}
      />

      {/* 2. Main 3-Column Area (calc(100vh - 64px)) */}
      <main className="flex-1 w-full grid grid-cols-12 overflow-hidden">
        {/* Left Column: Question Lists (~25% width -> 3 cols out of 12) */}
        <section className="col-span-3 h-full overflow-hidden border-r border-slate-700/80">
          <QuestionListPanel
            questions={CROSSWORD_QUESTIONS}
            activeQuestionNumber={activeQuestionNumber}
            solvedQuestions={solvedQuestions}
            onSelectQuestion={(num) => handleSelectQuestion(num)}
          />
        </section>

        {/* Center Column: Crossword Puzzle Board (~50% width -> 6 cols out of 12) */}
        <section className="col-span-6 h-full overflow-hidden flex flex-col">
          <CrosswordBoard
            grid={grid}
            activeQuestion={activeQuestion}
            activeCellCoord={activeCellCoord}
            solvedQuestions={solvedQuestions}
            feedbackState={feedbackState}
            onCellClick={handleCellClick}
          />
        </section>

        {/* Right Column: Narrator + Stats + Virtual Keyboard (~25% width -> 3 cols out of 12) */}
        <section className="col-span-3 h-full overflow-hidden flex flex-col bg-white border-l border-slate-700/80">
          {/* Top/Middle: Narrator & Active Clue Card */}
          <div className="flex-1 overflow-y-auto">
            <NarratorPanel
              activeQuestion={activeQuestion}
              isSpeaking={isSpeaking}
              score={progress.score}
              solvedCount={progress.solvedQuestions.size}
              totalQuestions={progress.totalQuestions}
              acrossSolved={progress.acrossSolved}
              acrossTotal={acrossTotal}
              downSolved={progress.downSolved}
              downTotal={downTotal}
              onReadActiveQuestion={handleReadActiveQuestion}
              onRepeatAudio={handleReadActiveQuestion}
            />
          </div>

          {/* Bottom: Touchscreen Virtual Keyboard */}
          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onPrevCell={handlePrevCell}
            onNextCell={handleNextCell}
            onClearWord={handleClearWord}
            onCheckAnswer={handleCheckAnswer}
            isWordSolved={isWordSolved}
          />
        </section>
      </main>

      {/* 3. Final Completion Modal (Only unlocked after 25/25 questions are solved) */}
      {showCompletionModal && (
        <CompletionModal
          score={progress.score}
          totalQuestions={progress.totalQuestions}
          solvedCount={progress.solvedQuestions.size}
          elapsedSeconds={elapsedSeconds}
          questions={CROSSWORD_QUESTIONS}
          onRestartGame={handleResetGame}
        />
      )}

      {/* 4. Teacher Panel Modal (Protected by Teacher Password) */}
      <TeacherPanelModal
        isOpen={showTeacherPanelModal}
        onClose={() => setShowTeacherPanelModal(false)}
        questions={CROSSWORD_QUESTIONS}
        activeQuestion={activeQuestion}
        onUnlockAllQuestions={handleUnlockAllQuestions}
        onUnlockActiveQuestion={handleUnlockActiveQuestion}
      />
    </div>
  );
}
