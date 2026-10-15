import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizSession, SystemSettings } from '../types/quiz';
import { CodeSnippet } from './CodeSnippet';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  X
} from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  categoryTitle: string;
  durationMinutes: number;
  settings: SystemSettings;
  userName: string;
  userId: string;
  onFinishQuiz: (session: QuizSession) => void;
  onExitQuiz: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  categoryTitle,
  durationMinutes,
  settings,
  userName,
  userId,
  onFinishQuiz,
  onExitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [startTime] = useState(Date.now());
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;

  // Complete and submit quiz
  const handleFinalSubmit = useCallback(() => {
    const endTime = Date.now();
    let score = 0;
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0 };
      }
      categoryBreakdown[q.category].total += 1;

      const userChoice = answers[q.id];
      if (userChoice !== undefined) {
        if (userChoice === q.correctOptionIndex) {
          score += q.points;
          categoryBreakdown[q.category].correct += 1;
        } else if (settings.penaltyForWrongAnswer) {
          score = Math.max(0, score - (q.points * settings.penaltyAmount));
        }
      }
    });

    const accuracyPercentage = totalQuestions > 0 
      ? Math.round((questions.filter(q => answers[q.id] === q.correctOptionIndex).length / totalQuestions) * 100)
      : 0;

    const session: QuizSession = {
      id: 'quiz-' + Date.now(),
      userId,
      userName,
      quizTitle: categoryTitle,
      totalQuestions,
      timeLimitMinutes: durationMinutes,
      startTime,
      endTime,
      isCompleted: true,
      userAnswers: answers,
      flaggedQuestions: Array.from(flagged),
      timeSpentSeconds: {},
      score: Math.round(score * 10) / 10,
      maxScore,
      accuracyPercentage,
      categoryBreakdown,
    };

    onFinishQuiz(session);
  }, [answers, categoryTitle, durationMinutes, flagged, onFinishQuiz, questions, settings, startTime, totalQuestions, userId, userName]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (settings.autoSubmitOnTimeUp) {
            handleFinalSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinalSubmit, settings.autoSubmitOnTimeUp]);

  // Keyboard shortcut for options: 1/2/3/4 or A/B/C/D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showExitConfirm) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (currentQuestion && optionIdx < currentQuestion.options.length) {
          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));
        }
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const mapping: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        const optionIdx = mapping[e.key.toLowerCase()];
        if (currentQuestion && optionIdx < currentQuestion.options.length) {
          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));
        }
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, showExitConfirm, showSubmitModal, totalQuestions]);

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining < 120; // less than 2 minutes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Quiz Progress & Live Timer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{categoryTitle}</span>
              <span aria-hidden="true">·</span>
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">{currentQuestion.title}</h1>
          </div>
        </div>

        {/* Central status: answered / flagged counter */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Answered: {answeredCount}/{totalQuestions}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Flagged: {flaggedCount}</span>
          </div>
        </div>

        {/* Timer Box & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm tabular-nums transition-colors ${
              isLowTime
                ? 'bg-rose-950/40 border-rose-600/50 text-rose-400 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
            {isLowTime && <span className="text-[10px] text-rose-300 font-sans">LOW TIME</span>}
          </div>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors cursor-pointer"
          >
            Abandon
          </button>
        </div>
      </div>

      {/* Main 2-Zone Split: Question Stage (Left/Center) + Navigator Palette (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3-cols: Question Stage */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
            {/* Metadata Bar (Unboxed text with separators per Zero-Pill rule) */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-amber-400 font-medium">{currentQuestion.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{currentQuestion.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">{currentQuestion.points} Marks</span>
                {currentQuestion.tags.map((tag) => (
                  <React.Fragment key={tag}>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-mono">{tag}</span>
                  </React.Fragment>
                ))}
              </div>

              {/* Flag Question for Review Button */}
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  flagged.has(currentQuestion.id)
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged.has(currentQuestion.id) ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base text-slate-100 font-medium leading-relaxed mb-4">
              {currentQuestion.questionText}
            </div>

            {/* Code Snippet if present */}
            {currentQuestion.codeSnippet && (
              <CodeSnippet
                code={currentQuestion.codeSnippet}
                language="java"
                filename={`${currentQuestion.id.replace('q-', '').toUpperCase()}.java`}
              />
            )}

            {/* Options List */}
            <div className="space-y-3 mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Your Answer (Press 1-4 or A-D):
              </div>
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer group ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                      }`}
                    >
                      {optLetter}
                    </div>
                    <div className="flex-1 text-sm pt-0.5 leading-relaxed font-sans">
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear option selection button if answered */}
            {answers[currentQuestion.id] !== undefined && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[currentQuestion.id];
                      return next;
                    });
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Stepper Bottom Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              Question {currentIndex + 1} of {totalQuestions}
            </div>

            <div className="flex items-center gap-3">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors flex items-center gap-2 text-sm cursor-pointer shadow-md"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors flex items-center gap-2 text-sm cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1-col: Question Navigator Palette Deck */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Question Navigator</h3>
              <span className="text-xs font-mono text-slate-400">
                {answeredCount}/{totalQuestions} Done
              </span>
            </div>

            {/* Grid Palette */}
            <div className="grid grid-cols-5 gap-2 my-4">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flagged.has(q.id);

                let bgClass = 'bg-slate-950 text-slate-400 border-slate-800';
                if (isAnswered) {
                  bgClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60 font-semibold';
                }
                if (isCurrent) {
                  bgClass += ' ring-2 ring-amber-400 border-amber-400 text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg border text-xs font-mono relative flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                    title={`Question ${idx + 1}: ${q.title}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-700"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-amber-400 bg-amber-400/20 relative">
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                </div>
                <span>Flagged for Review</span>
              </div>
            </div>

            {/* Direct Submit Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full mt-6 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review & Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Submit Assessment?</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to finalize and submit your quiz answers? You will receive an instant performance evaluation and detailed feedback.
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Total Questions:</span>
                <span className="text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Answered:</span>
                <span className="text-emerald-400 font-bold">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unanswered:</span>
                <span className="text-rose-400 font-bold">{totalQuestions - answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Flagged for Review:</span>
                <span className="text-amber-400 font-bold">{flaggedCount}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Remaining Time:</span>
                <span className="text-amber-400 font-bold">{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Abandon Quiz Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Leave Quiz Session?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your current progress in this timed quiz will not be recorded in the leaderboard if you exit now.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onExitQuiz}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
              >
                Exit to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
