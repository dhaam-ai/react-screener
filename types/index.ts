export interface Question {
  id: number;
  category: 'React v19' | 'Tailwind CSS v4';
  level: 'Junior' | 'Intermediate' | 'Advanced';
  question: string;
  expectedAnswer: string;
  timeLimit: number; // in seconds
}

export interface UserAnswer {
  questionId: number;
  answer: string;
  timeSpent: number; // in seconds
}

export interface QuestionTimer {
  questionId: number;
  startTime: number; // timestamp when question was first accessed
  timeRemaining: number; // seconds left
  isExpired: boolean;
  lastUpdated: number; // timestamp of last update
  hasBeenAccessed: boolean; // whether user has visited this question
}

export interface ScreeningSession {
  email: string;
  startTime: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  completed: boolean;
  questionTimers: QuestionTimer[]; // Individual timer states
  globalStartTime: number; // When interview started
  highestQuestionAccessed: number; // Highest question number accessed
}

export interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}
