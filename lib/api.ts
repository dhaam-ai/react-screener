import { ScreeningSession, UserAnswer, QuestionTimer } from '@/types';
import { questions, getTotalQuestions } from './questions';

const API_ENDPOINT = 'https://v1.nocodeapi.com/nexusdhaam/google_sheets/PgsAJvPMQeXixxNr?tabId=Sheet1';

export type SubmissionData = any[];

export async function submitToGoogleSheets(session: ScreeningSession): Promise<boolean> {
  try {
    // Prepare the data in the format expected by the Google Sheets API
    const submissionData: SubmissionData = [ [
      session.email,
      new Date().toISOString(),
      calculateTotalTime(session.answers),
    ]
    ];

    // Add each question and answer to the submission data
    questions.forEach((question) => {
      const answer = session.answers.find(a => a.questionId === question.id);
      submissionData.push([
         question.question,
         answer?.answer ?? "Not answered",
         answer ? formatTime(answer.timeSpent) : "N/A"      ])
    });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData), // API expects an array
    });
    console.log('Response from Google Sheets API:', submissionData);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return false;
  }
}

function calculateTotalTime(answers: UserAnswer[]): string {
  const totalSeconds = answers.reduce((total, answer) => total + answer.timeSpent, 0);
  return formatTime(totalSeconds);
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Session management utilities
export function saveSession(session: ScreeningSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('screening_session', JSON.stringify(session));
  }
}

export function loadSession(): ScreeningSession | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('screening_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('screening_session');
  }
}

export function createNewSession(email: string): ScreeningSession {
  const now = Date.now();
  
  // Initialize timers for all questions
  const questionTimers: QuestionTimer[] = questions.map((question) => ({
    questionId: question.id,
    startTime: 0,
    timeRemaining: question.timeLimit,
    isExpired: false,
    lastUpdated: now,
    hasBeenAccessed: false,
  }));

  return {
    email,
    startTime: new Date(),
    answers: [],
    currentQuestionIndex: 0,
    completed: false,
    questionTimers,
    globalStartTime: now,
    highestQuestionAccessed: 0,
  };
}

// Timer management functions
export function updateQuestionTimer(
  session: ScreeningSession,
  questionId: number,
  timeRemaining: number
): ScreeningSession {
  const updatedTimers = session.questionTimers.map((timer) => {
    if (timer.questionId === questionId) {
      const now = Date.now();
      return {
        ...timer,
        timeRemaining: Math.max(0, timeRemaining),
        isExpired: timeRemaining <= 0,
        lastUpdated: now,
        startTime: timer.startTime || now,
        hasBeenAccessed: true,
      };
    }
    return timer;
  });

  const updatedSession = {
    ...session,
    questionTimers: updatedTimers,
    highestQuestionAccessed: Math.max(session.highestQuestionAccessed, questionId),
  };

  saveSession(updatedSession);
  return updatedSession;
}

export function getQuestionTimer(
  session: ScreeningSession,
  questionId: number
): QuestionTimer | undefined {
  return session.questionTimers.find((timer) => timer.questionId === questionId);
}

export function calculateActualTimeRemaining(timer: QuestionTimer): number {
  if (timer.isExpired) return 0;
  if (!timer.hasBeenAccessed) return timer.timeRemaining;
  
  const now = Date.now();
  const elapsedSinceUpdate = Math.floor((now - timer.lastUpdated) / 1000);
  return Math.max(0, timer.timeRemaining - elapsedSinceUpdate);
}

export function areAllTimersExpired(session: ScreeningSession): boolean {
  return session.questionTimers
    .slice(0, session.highestQuestionAccessed)
    .every((timer) => {
      if (!timer.hasBeenAccessed) return false;
      const actualTime = calculateActualTimeRemaining(timer);
      return actualTime <= 0 || timer.isExpired;
    });
}

export function canAccessQuestion(session: ScreeningSession, questionId: number): boolean {
  // Can access if it's the next question or a previously accessed question
  return questionId <= session.highestQuestionAccessed + 1;
}
