export type Category =
  | 'Core OOP'
  | 'Collections & Generics'
  | 'Multithreading & Concurrency'
  | 'JDBC & Database'
  | 'Exception Handling & IO'
  | 'Java 8+ Streams & Lambdas'
  | 'JVM & Web Architecture';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  title: string;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  explanation: string;
  points: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  userName: string;
  quizTitle: string;
  categoryFilter?: Category | 'All';
  totalQuestions: number;
  timeLimitMinutes: number;
  startTime: number;
  endTime?: number;
  isCompleted: boolean;
  userAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  flaggedQuestions: string[];
  timeSpentSeconds: Record<string, number>;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSeconds: number;
  completedAt: string;
  category: string;
  badge: string;
  isCurrentUser?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  joinedDate: string;
  quizzesTaken: number;
  averageScore: number;
  status: 'active' | 'suspended';
}

export interface SystemSettings {
  defaultQuizDurationMinutes: number;
  passPercentageThreshold: number;
  allowQuestionReview: boolean;
  randomizeQuestions: boolean;
  penaltyForWrongAnswer: boolean;
  penaltyAmount: number; // e.g. 0.25 points
  autoSubmitOnTimeUp: boolean;
  academicRubricEnabled: boolean;
}
