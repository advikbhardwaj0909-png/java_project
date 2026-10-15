import { Question, UserAccount, LeaderboardEntry, SystemSettings, QuizSession } from '../types/quiz';
import { INITIAL_QUESTIONS } from '../data/questions';

const STORAGE_KEYS = {
  QUESTIONS: 'javamaster_questions',
  USERS: 'javamaster_users',
  LEADERBOARD: 'javamaster_leaderboard',
  SETTINGS: 'javamaster_settings',
  ATTEMPTS: 'javamaster_attempts',
  CURRENT_USER: 'javamaster_current_user',
};

export const DEFAULT_SETTINGS: SystemSettings = {
  defaultQuizDurationMinutes: 10,
  passPercentageThreshold: 70,
  allowQuestionReview: true,
  randomizeQuestions: true,
  penaltyForWrongAnswer: false,
  penaltyAmount: 0.25,
  autoSubmitOnTimeUp: true,
  academicRubricEnabled: true,
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-advik',
    name: 'Advik Bhardwaj',
    email: 'advikbhardwaj0909@gmail.com',
    role: 'student',
    joinedDate: '2026-09-05',
    quizzesTaken: 8,
    averageScore: 92.5,
    status: 'active',
  },
  {
    id: 'user-admin',
    name: 'Prof. Marcus Vance (Admin)',
    email: 'm.vance@university.edu',
    role: 'admin',
    joinedDate: '2026-08-15',
    quizzesTaken: 14,
    averageScore: 98.0,
    status: 'active',
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@dev.io',
    role: 'student',
    joinedDate: '2026-09-12',
    quizzesTaken: 6,
    averageScore: 88.0,
    status: 'active',
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@tech.org',
    role: 'instructor',
    joinedDate: '2026-08-20',
    quizzesTaken: 5,
    averageScore: 94.0,
    status: 'active',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    userId: 'user-advik',
    userName: 'Advik Bhardwaj',
    score: 100,
    maxScore: 100,
    accuracy: 100,
    timeSeconds: 342,
    completedAt: 'Just now',
    category: 'All Java Topics',
    badge: '🏆 Java Virtuoso',
    isCurrentUser: true,
  },
  {
    id: 'lb-2',
    userId: 'user-sarah',
    userName: 'Sarah Chen',
    score: 95,
    maxScore: 100,
    accuracy: 95,
    timeSeconds: 388,
    completedAt: '12m ago',
    category: 'Multithreading & Concurrency',
    badge: '⚡ Thread Master',
  },
  {
    id: 'lb-3',
    userId: 'user-dev3',
    userName: 'Kavita Patel',
    score: 90,
    maxScore: 100,
    accuracy: 90,
    timeSeconds: 410,
    completedAt: '35m ago',
    category: 'Core OOP',
    badge: '🔷 OOP Architect',
  },
  {
    id: 'lb-4',
    userId: 'user-dev4',
    userName: 'David Miller',
    score: 90,
    maxScore: 100,
    accuracy: 90,
    timeSeconds: 445,
    completedAt: '1h ago',
    category: 'JDBC & Database',
    badge: '🗄️ SQL & JDBC Pro',
  },
  {
    id: 'lb-5',
    userId: 'user-dev5',
    userName: 'Elena Rostova',
    score: 85,
    maxScore: 100,
    accuracy: 85,
    timeSeconds: 460,
    completedAt: '2h ago',
    category: 'Collections & Generics',
    badge: '📦 Collection Maven',
  },
  {
    id: 'lb-6',
    userId: 'user-dev6',
    userName: 'Takeshi Yamada',
    score: 80,
    maxScore: 100,
    accuracy: 80,
    timeSeconds: 512,
    completedAt: '4h ago',
    category: 'Java 8+ Streams & Lambdas',
    badge: 'λ Lambda Specialist',
  },
];

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserAccount[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: SystemSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveStoredLeaderboard(entries: LeaderboardEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(entries));
}

export function getStoredAttempts(): QuizSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizSession): void {
  const existing = getStoredAttempts();
  const updated = [attempt, ...existing];
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));

  // Add to leaderboard
  const lb = getStoredLeaderboard();
  const timeTaken = attempt.endTime && attempt.startTime
    ? Math.max(1, Math.round((attempt.endTime - attempt.startTime) / 1000))
    : 300;

  let badge = '⭐ Java Achiever';
  if (attempt.accuracyPercentage === 100) badge = '🏆 Java Virtuoso';
  else if (attempt.accuracyPercentage >= 90) badge = '⚡ High Precision';
  else if (attempt.accuracyPercentage >= 75) badge = '🎯 Proficient Coder';

  const newEntry: LeaderboardEntry = {
    id: 'lb-' + Date.now(),
    userId: attempt.userId,
    userName: attempt.userName,
    score: Math.round(attempt.score),
    maxScore: attempt.maxScore,
    accuracy: Math.round(attempt.accuracyPercentage),
    timeSeconds: timeTaken,
    completedAt: 'Just now',
    category: attempt.categoryFilter || 'All Java Topics',
    badge,
    isCurrentUser: true,
  };

  const updatedLb = [newEntry, ...lb.map(e => ({ ...e, isCurrentUser: false }))].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSeconds - b.timeSeconds;
  });

  saveStoredLeaderboard(updatedLb);
}

export function getCurrentUser(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_USERS[0]; // Advik Bhardwaj default
}

export function setCurrentUser(user: UserAccount): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}
