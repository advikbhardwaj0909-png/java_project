import React, { useState } from 'react';
import { Question, Category, Difficulty, SystemSettings, QuizSession } from '../types/quiz';
import { CATEGORIES } from '../data/questions';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Award, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  Terminal,
  Cpu,
  Database,
  Shuffle
} from 'lucide-react';

interface QuizCatalogProps {
  questions: Question[];
  settings: SystemSettings;
  recentAttempts: QuizSession[];
  onStartQuiz: (selectedQuestions: Question[], title: string, durationMinutes: number) => void;
  onViewRubric: () => void;
}

export const QuizCatalog: React.FC<QuizCatalogProps> = ({
  questions,
  settings,
  recentAttempts,
  onStartQuiz,
  onViewRubric,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(5);
  const [customDuration, setCustomDuration] = useState<number>(settings.defaultQuizDurationMinutes);
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');

  // Pre-configured curated track bundles
  const CURATED_TRACKS = [
    {
      id: 'full-mock',
      title: 'Java SE 21 Comprehensive Mock Exam',
      description: 'Timed full-spectrum assessment spanning OOP, Collections, Concurrency, JDBC, Streams, and JVM internals.',
      category: 'All Java Topics',
      duration: 12,
      icon: Terminal,
      accent: 'border-amber-500/40 hover:border-amber-500',
      difficulty: 'Intermediate / Advanced',
      questionFilter: (q: Question) => true,
    },
    {
      id: 'track-oop',
      title: 'Core OOP & Type Polymorphism Challenge',
      description: 'Master dynamic dispatch, interface contracts, multiple default method diamond conflicts, and object lifecycle.',
      category: 'Core OOP',
      duration: 8,
      icon: Layers,
      accent: 'border-cyan-500/40 hover:border-cyan-500',
      difficulty: 'Intermediate',
      questionFilter: (q: Question) => q.category === 'Core OOP',
    },
    {
      id: 'track-concurrency',
      title: 'Multithreading & Concurrency Hardening',
      description: 'Test deep knowledge of JMM memory barriers, volatile happens-before, ReentrantLocks, and thread states.',
      category: 'Multithreading & Concurrency',
      duration: 8,
      icon: Cpu,
      accent: 'border-purple-500/40 hover:border-purple-500',
      difficulty: 'Advanced',
      questionFilter: (q: Question) => q.category === 'Multithreading & Concurrency',
    },
    {
      id: 'track-jdbc',
      title: 'JDBC & Database Architecture Evaluation',
      description: 'Assesses PreparedStatement injection defenses, DAO design, connection pools, and ACID transaction rollbacks.',
      category: 'JDBC & Database',
      duration: 6,
      icon: Database,
      accent: 'border-emerald-500/40 hover:border-emerald-500',
      difficulty: 'Intermediate',
      questionFilter: (q: Question) => q.category === 'JDBC & Database',
    },
    {
      id: 'track-collections',
      title: 'Collections, Generics & Data Structures',
      description: 'HashMap red-black treeification, PECS wildcard variance, and thread-safe ConcurrentCollections.',
      category: 'Collections & Generics',
      duration: 8,
      icon: BookOpen,
      accent: 'border-rose-500/40 hover:border-rose-500',
      difficulty: 'Intermediate',
      questionFilter: (q: Question) => q.category === 'Collections & Generics',
    },
    {
      id: 'track-streams',
      title: 'Modern Java 8+ Streams & Lambdas',
      description: 'Intermediate vs terminal pipelines, flatMap, collector groupings, and lazy evaluation semantics.',
      category: 'Java 8+ Streams & Lambdas',
      duration: 6,
      icon: Terminal,
      accent: 'border-amber-400/40 hover:border-amber-400',
      difficulty: 'Beginner / Intermediate',
      questionFilter: (q: Question) => q.category === 'Java 8+ Streams & Lambdas',
    },
  ];

  const handleStartCurated = (track: typeof CURATED_TRACKS[0]) => {
    let pool = questions.filter(track.questionFilter);
    if (pool.length === 0) pool = questions; // fallback
    if (settings.randomizeQuestions) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }
    onStartQuiz(pool, track.title, track.duration);
  };

  const handleStartCustom = () => {
    let pool = questions.filter((q) => {
      const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });

    if (pool.length === 0) {
      alert('No questions match your filter combinations. Try choosing "All Categories".');
      return;
    }

    if (settings.randomizeQuestions) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    const finalQuestions = pool.slice(0, customQuestionCount);
    const title = `${selectedCategory === 'All' ? 'Custom Java' : selectedCategory} Quiz (${finalQuestions.length} Questions)`;
    onStartQuiz(finalQuestions, title, customDuration);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <span>● Java Assessment Engine 2026</span>
            <span aria-hidden="true">·</span>
            <span>Academic Rubric Aligned</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Java Programming Online Quiz Platform
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Timed, rigorous programming assessments tailored for Java software engineers and students. Test your knowledge in Core OOP, Collections, Concurrency, JDBC, and JVM architecture with real-time feedback and diagnostic analytics.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleStartCurated(CURATED_TRACKS[0])}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Full Certification Mock</span>
            </button>

            <button
              onClick={onViewRubric}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border border-slate-700"
            >
              <span>View Marking Rubric & Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Curated vs Custom) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'curated'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Assessment Tracks</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Topic Quiz Builder</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
          Total Question Repository: {questions.length} Questions
        </span>
      </div>

      {/* CURATED TRACKS VIEW */}
      {activeTab === 'curated' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_TRACKS.map((track) => {
            const Icon = track.icon;
            const matchingCount = questions.filter(track.questionFilter).length;

            return (
              <div
                key={track.id}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all hover:bg-slate-850 flex flex-col justify-between ${track.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{track.duration} mins</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{track.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{track.description}</p>
                </div>

                <div>
                  {/* Unboxed metadata text */}
                  <div className="text-xs text-slate-500 flex items-center gap-2 mb-4 pb-3 border-t border-slate-800 font-mono">
                    <span>{track.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{matchingCount} Questions</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{track.difficulty}</span>
                  </div>

                  <button
                    onClick={() => handleStartCurated(track)}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Commence Assessment</span>
                    <Play className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOM QUIZ BUILDER VIEW */}
      {activeTab === 'custom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Configure Custom Java Quiz</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your targeted domain tags, question count, and timer duration.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Topic / Category Tag
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="All">All Categories (Comprehensive Mix)</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Question Count
                </label>
                <select
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer font-mono"
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard Practice)</option>
                  <option value={10}>10 Questions (In-Depth Review)</option>
                  <option value={15}>15 Questions (Full Assessment)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Timer Limit: <span className="text-amber-400 font-mono">{customDuration} Minutes</span>
              </label>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>3 mins (Fast)</span>
                <span>15 mins (Standard)</span>
                <span>30 mins (Relaxed)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleStartCustom}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Custom Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attempts History */}
      {recentAttempts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-3">Your Recent Examination History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentAttempts.slice(0, 3).map((att) => {
              const isPassed = att.accuracyPercentage >= settings.passPercentageThreshold;
              return (
                <div key={att.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="truncate max-w-[150px] font-medium text-slate-200">{att.quizTitle}</span>
                    <span className="font-mono">{new Date(att.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-white">
                      Score: <strong className={isPassed ? 'text-emerald-400' : 'text-amber-400'}>{att.score}/{att.maxScore}</strong>
                    </span>
                    <span className={`font-mono text-[11px] ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {att.accuracyPercentage}% ({isPassed ? 'Passed' : 'Failed'})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
