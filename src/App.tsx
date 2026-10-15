/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Question, 
  UserAccount, 
  LeaderboardEntry, 
  SystemSettings, 
  QuizSession 
} from './types/quiz';
import { 
  getStoredQuestions, 
  saveStoredQuestions,
  getStoredUsers, 
  saveStoredUsers,
  getStoredSettings, 
  saveStoredSettings,
  getStoredLeaderboard, 
  saveStoredLeaderboard,
  getStoredAttempts, 
  saveQuizAttempt,
  getCurrentUser, 
  setCurrentUser 
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { QuizCatalog } from './components/QuizCatalog';
import { QuizEngine } from './components/QuizEngine';
import { QuizResultView } from './components/QuizResultView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProjectRubricModal } from './components/ProjectRubricModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'leaderboard' | 'rubric' | 'admin'>('catalog');
  
  // Storage state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [attempts, setAttempts] = useState<QuizSession[]>([]);
  const [currentUser, setCurrUser] = useState<UserAccount>(getCurrentUser());

  // Active quiz runtime
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[] | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [activeQuizDuration, setActiveQuizDuration] = useState<number>(10);
  const [completedSession, setCompletedSession] = useState<QuizSession | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setQuestions(getStoredQuestions());
    setUsers(getStoredUsers());
    setSettings(getStoredSettings());
    setLeaderboard(getStoredLeaderboard());
    setAttempts(getStoredAttempts());
    setCurrUser(getCurrentUser());
  }, []);

  // Handlers for state updates
  const handleUpdateQuestions = (updated: Question[]) => {
    setQuestions(updated);
    saveStoredQuestions(updated);
  };

  const handleUpdateUsers = (updated: UserAccount[]) => {
    setUsers(updated);
    saveStoredUsers(updated);
  };

  const handleUpdateSettings = (updated: SystemSettings) => {
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleSwitchUserRole = (role: 'student' | 'admin' | 'instructor') => {
    const match = users.find((u) => u.role === role) || {
      ...currentUser,
      role,
    };
    setCurrUser(match);
    setCurrentUser(match);
    if (role === 'admin') {
      setCurrentTab('admin');
    }
  };

  // Launch a timed quiz
  const handleStartQuiz = (selectedQuestions: Question[], title: string, durationMinutes: number) => {
    setActiveQuizQuestions(selectedQuestions);
    setActiveQuizTitle(title);
    setActiveQuizDuration(durationMinutes);
    setCompletedSession(null);
  };

  // On Quiz Finish
  const handleFinishQuiz = (session: QuizSession) => {
    saveQuizAttempt(session);
    setCompletedSession(session);
    setActiveQuizQuestions(null);
    setAttempts(getStoredAttempts());
    setLeaderboard(getStoredLeaderboard());
  };

  // Cancel / Abandon quiz
  const handleExitQuiz = () => {
    setActiveQuizQuestions(null);
  };

  // Retake completed quiz
  const handleRetakeQuiz = () => {
    if (!completedSession) return;
    const matched = questions.filter((q) => completedSession.categoryBreakdown[q.category]);
    const quizPool = matched.length > 0 ? matched : questions;
    setActiveQuizQuestions(quizPool);
    setActiveQuizTitle(completedSession.quizTitle);
    setActiveQuizDuration(completedSession.timeLimitMinutes);
    setCompletedSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCompletedSession(null);
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onSwitchUserRole={handleSwitchUserRole}
        isQuizActive={activeQuizQuestions !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* State 1: Active Timed Quiz Session */}
        {activeQuizQuestions !== null ? (
          <QuizEngine
            questions={activeQuizQuestions}
            categoryTitle={activeQuizTitle}
            durationMinutes={activeQuizDuration}
            settings={settings}
            userName={currentUser.name}
            userId={currentUser.id}
            onFinishQuiz={handleFinishQuiz}
            onExitQuiz={handleExitQuiz}
          />
        ) : completedSession !== null ? (
          /* State 2: Performance Evaluation & Feedback Report */
          <QuizResultView
            session={completedSession}
            questions={questions}
            settings={settings}
            onRetake={handleRetakeQuiz}
            onGoToLeaderboard={() => {
              setCompletedSession(null);
              setCurrentTab('leaderboard');
            }}
            onGoToCatalog={() => {
              setCompletedSession(null);
              setCurrentTab('catalog');
            }}
          />
        ) : (
          /* State 3: Primary Navigation Tabs */
          <>
            {currentTab === 'catalog' && (
              <QuizCatalog
                questions={questions}
                settings={settings}
                recentAttempts={attempts}
                onStartQuiz={handleStartQuiz}
                onViewRubric={() => setCurrentTab('rubric')}
              />
            )}

            {currentTab === 'leaderboard' && (
              <LeaderboardView
                entries={leaderboard}
                onTakeQuizClick={() => setCurrentTab('catalog')}
              />
            )}

            {currentTab === 'rubric' && (
              <ProjectRubricModal />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                questions={questions}
                users={users}
                settings={settings}
                onUpdateQuestions={handleUpdateQuestions}
                onUpdateUsers={handleUpdateUsers}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </>
        )}
      </main>

      {/* Clean, quiet footer without telemetry or artificial tags */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">JavaMaster</span>
            <span>·</span>
            <span>Java Programming Examination & Evaluation Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Core Java SE 21</span>
            <span>·</span>
            <span>JDBC & Concurrency Compliant</span>
            <span>·</span>
            <span>Academic Marking Rubric 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
