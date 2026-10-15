import React, { useState } from 'react';
import { QuizSession, Question, SystemSettings } from '../types/quiz';
import { CodeSnippet } from './CodeSnippet';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ListFilter, 
  FileText, 
  Check, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen
} from 'lucide-react';

interface QuizResultViewProps {
  session: QuizSession;
  questions: Question[];
  settings: SystemSettings;
  onRetake: () => void;
  onGoToLeaderboard: () => void;
  onGoToCatalog: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  session,
  questions,
  settings,
  onRetake,
  onGoToLeaderboard,
  onGoToCatalog,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isPassed = session.accuracyPercentage >= settings.passPercentageThreshold;
  const timeTakenSeconds = session.endTime && session.startTime
    ? Math.max(1, Math.round((session.endTime - session.startTime) / 1000))
    : 300;

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const secondsRemain = timeTakenSeconds % 60;
  const avgTimePerQuestion = Math.round(timeTakenSeconds / Math.max(1, session.totalQuestions));

  // Filter questions for detailed review
  const filteredQuestions = questions.filter((q) => {
    const userChoice = session.userAnswers[q.id];
    const isCorrect = userChoice === q.correctOptionIndex;
    const isFlagged = session.flaggedQuestions.includes(q.id);

    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    if (filterMode === 'flagged') return isFlagged;
    return true;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(
      `I scored ${session.score}/${session.maxScore} (${session.accuracyPercentage}%) on the JavaMaster "${session.quizTitle}" assessment!`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Performance Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
              <span>Performance Evaluation Report</span>
              <span aria-hidden="true">·</span>
              <span>Candidate: {session.userName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{session.quizTitle}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {isPassed ? 'Assessment Completed: Passed' : 'Assessment Completed: Review Needed'}
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              {isPassed
                ? 'Outstanding work! You demonstrated solid mastery of Java programming principles and runtime specifications.'
                : 'Good effort! Review the detailed conceptual feedback below to strengthen your grasp of key Java paradigms.'}
            </p>
          </div>

          {/* Big Score Callout */}
          <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-xl px-8 py-5 text-center min-w-[200px]">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-1">
              Final Score
            </div>
            <div className="text-4xl font-black font-mono tracking-tight text-white">
              <span className={isPassed ? 'text-emerald-400' : 'text-amber-400'}>
                {session.score}
              </span>
              <span className="text-slate-600 text-2xl font-normal"> / {session.maxScore}</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Accuracy: <strong className="text-white">{session.accuracyPercentage}%</strong> (Pass: {settings.passPercentageThreshold}%)
            </div>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Taken</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-100 mt-1">
              {minutesTaken}m {secondsRemain}s
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Limit: {session.timeLimitMinutes}m</div>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Correct Answers</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              {questions.filter(q => session.userAnswers[q.id] === q.correctOptionIndex).length}
              <span className="text-xs text-slate-500 font-normal"> / {session.totalQuestions}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Incorrect: {questions.filter(q => session.userAnswers[q.id] !== undefined && session.userAnswers[q.id] !== q.correctOptionIndex).length}
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Average Speed</span>
            </div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
              {avgTimePerQuestion}s
            </div>
            <div className="text-[11px] text-slate-500 font-mono">per question</div>
          </div>

          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Status</span>
            </div>
            <div className={`text-lg font-bold mt-1 ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isPassed ? 'PASSED' : 'NEEDS PRACTICE'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Threshold {settings.passPercentageThreshold}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6 justify-end">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Result Copied!' : 'Share Result'}</span>
          </button>

          <button
            onClick={() => setShowCertificate(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>View Certificate</span>
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onGoToLeaderboard}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            View Leaderboard
          </button>
        </div>
      </div>

      {/* Category Breakdown & Mastery Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Category Mastery & Diagnostic Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(session.categoryBreakdown).map(([category, stats]) => {
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const isCategoryStrong = pct >= 70;

            return (
              <div key={category} className="bg-slate-950 rounded-lg p-3.5 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{category}</span>
                  <span className="font-mono text-slate-400">
                    <strong className={isCategoryStrong ? 'text-emerald-400' : 'text-amber-400'}>
                      {stats.correct}/{stats.total}
                    </strong>{' '}
                    ({pct}%)
                  </span>
                </div>
                {/* Progress track */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct === 100
                        ? 'bg-emerald-400'
                        : pct >= 60
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question Review & Educational Feedback */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Itemized Question Feedback & Technical Rationales</h3>
            <p className="text-xs text-slate-400">
              Inspect answer choices, JLS specifications, and architectural insights.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                filterMode === 'correct' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Correct
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                filterMode === 'incorrect' ? 'bg-slate-800 text-rose-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Incorrect
            </button>
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                filterMode === 'flagged' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flagged ({session.flaggedQuestions.length})
            </button>
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const userChoice = session.userAnswers[q.id];
            const isCorrect = userChoice === q.correctOptionIndex;
            const isUnanswered = userChoice === undefined;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`bg-slate-900 border rounded-xl overflow-hidden transition-all ${
                  isCorrect
                    ? 'border-emerald-950/80 hover:border-emerald-800/60'
                    : isUnanswered
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-rose-950/80 hover:border-rose-800/60'
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isUnanswered
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓' : isUnanswered ? '—' : '✕'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span>{q.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-500">{q.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">{q.points} pts</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{q.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium font-mono hidden sm:inline-block ${
                        isCorrect ? 'text-emerald-400' : isUnanswered ? 'text-slate-500' : 'text-rose-400'
                      }`}
                    >
                      {isCorrect ? 'Correct (+10 pts)' : isUnanswered ? 'Unanswered (0 pts)' : 'Incorrect (0 pts)'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 space-y-4 bg-slate-950/40">
                    <div className="text-sm text-slate-200">{q.questionText}</div>

                    {q.codeSnippet && (
                      <CodeSnippet code={q.codeSnippet} language="java" filename={`${q.id}.java`} />
                    )}

                    {/* Options Breakdown */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Answer Options Analysis:
                      </div>
                      {q.options.map((option, optIdx) => {
                        const isOptionCorrect = optIdx === q.correctOptionIndex;
                        const isOptionChosen = userChoice === optIdx;

                        let optClass = 'bg-slate-900 border-slate-800 text-slate-300';
                        if (isOptionCorrect) {
                          optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                        } else if (isOptionChosen && !isOptionCorrect) {
                          optClass = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${optClass}`}
                          >
                            <span className="font-mono font-bold w-5 shrink-0 text-slate-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <div className="flex-1 font-sans leading-relaxed">
                              {option}
                              {isOptionCorrect && (
                                <span className="ml-2 inline-flex items-center gap-1 font-semibold text-emerald-400">
                                  ✓ Correct Choice
                                </span>
                              )}
                              {isOptionChosen && !isOptionCorrect && (
                                <span className="ml-2 inline-flex items-center gap-1 font-semibold text-rose-400">
                                  ✕ Your Selection
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Technical Rationale & JLS Citation */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs space-y-1.5">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Java Technical Explanation & Architectural Rationale:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-amber-500/20 pb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase tracking-widest font-mono text-amber-400">
                Official Certification of Achievement
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Java Programming Proficiency Certificate
              </h2>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 py-4">
              <p className="text-xs text-slate-400">This is to certify that</p>
              <h3 className="text-xl font-bold text-amber-300 font-sans tracking-wide">
                {session.userName}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed the comprehensive timed assessment on{' '}
                <strong className="text-white">{session.quizTitle}</strong> with a passing score of{' '}
                <strong className="text-emerald-400">{session.accuracyPercentage}% ({session.score}/{session.maxScore} marks)</strong>.
              </p>
            </div>

            {/* Certificate Footer with verification */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div>
                <span>Certificate ID: </span>
                <span className="text-slate-300">JM-2026-{session.id.slice(-6).toUpperCase()}</span>
              </div>
              <div>
                <span>Issue Date: </span>
                <span className="text-slate-300">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
