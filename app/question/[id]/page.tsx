'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { questions, getTotalQuestions } from '@/lib/questions';
import { 
  loadSession, 
  saveSession, 
  submitToGoogleSheets,
  updateQuestionTimer,
  getQuestionTimer,
  calculateActualTimeRemaining,
  areAllTimersExpired,
  canAccessQuestion
} from '@/lib/api';
import { ScreeningSession, QuestionTimer } from '@/types';

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<ScreeningSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTimer, setCurrentTimer] = useState<QuestionTimer | null>(null);
  const autoSubmitRef = useRef(false);
  
  const questionId = parseInt(params.id as string);
  const currentQuestion = questions.find(q => q.id === questionId);
  const totalQuestions = getTotalQuestions();

  // Check for auto-submission when all timers expire
  useEffect(() => {
    if (!session || autoSubmitRef.current) return;

    const checkAllTimersExpired = setInterval(() => {
      const freshSession = loadSession();
      if (freshSession && areAllTimersExpired(freshSession) && !freshSession.completed) {
        autoSubmitRef.current = true;
        handleAutoSubmit(freshSession);
      }
    }, 1000);

    return () => clearInterval(checkAllTimersExpired);
  }, [session]);

  const handleAutoSubmit = async (sessionToSubmit: ScreeningSession) => {
    sessionToSubmit.completed = true;
    saveSession(sessionToSubmit);
    
    setIsLoading(true);
    const success = await submitToGoogleSheets(sessionToSubmit);
    
    if (success) {
      router.push('/success');
    } else {
      alert('Failed to auto-submit your answers. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load session from localStorage
    const savedSession = loadSession();
    if (!savedSession || !savedSession.email) {
      router.push('/');
      return;
    }

    // Check if user can access this question
    if (!canAccessQuestion(savedSession, questionId)) {
      router.push(`/question/${savedSession.highestQuestionAccessed || 1}`);
      return;
    }

    // Get the timer for this question
    const timer = getQuestionTimer(savedSession, questionId);
    if (timer) {
      // Calculate actual time remaining based on timestamps
      const actualTimeRemaining = calculateActualTimeRemaining(timer);
      
      // Update timer with actual time
      const updatedTimer = {
        ...timer,
        timeRemaining: actualTimeRemaining,
        isExpired: actualTimeRemaining <= 0
      };
      
      setCurrentTimer(updatedTimer);
      
      // Update session if this is a new question being accessed
      if (!timer.hasBeenAccessed) {
        const updatedSession = updateQuestionTimer(savedSession, questionId, actualTimeRemaining);
        setSession(updatedSession);
      } else {
        setSession(savedSession);
      }
    }

    setIsLoading(false);
  }, [questionId, router]);

  const handleTimeUpdate = useCallback((timeRemaining: number) => {
    if (!session || !currentTimer) return;
    
    // Only update if time has significantly changed (every 5 seconds) or is about to expire
    const shouldUpdate = timeRemaining === 0 || 
                        timeRemaining % 5 === 0 || 
                        timeRemaining <= 10;
    
    if (shouldUpdate) {
      // Update timer in session
      const updatedSession = updateQuestionTimer(session, questionId, timeRemaining);
      setSession(updatedSession);
    }
    
    // Always update local timer state
    setCurrentTimer(prev => ({
      ...prev!,
      timeRemaining,
      isExpired: timeRemaining <= 0
    }));
  }, [session?.email, questionId]); // Only depend on stable values

  const handleSubmit = async (answer: string, timeSpent: number) => {
    if (!session || !currentQuestion || !currentTimer) return;

    // Save the answer
    const existingAnswerIndex = session.answers.findIndex(a => a.questionId === currentQuestion.id);
    const newAnswer = {
      questionId: currentQuestion.id,
      answer,
      timeSpent,
    };

    const updatedAnswers = existingAnswerIndex >= 0
      ? session.answers.map((a, i) => i === existingAnswerIndex ? newAnswer : a)
      : [...session.answers, newAnswer];

    const updatedSession = {
      ...session,
      answers: updatedAnswers,
      currentQuestionIndex: questionId,
    };

    // Check if this is the last question
    if (questionId === totalQuestions) {
      updatedSession.completed = true;
      saveSession(updatedSession);
      
      // Submit to Google Sheets
      setIsLoading(true);
      const success = await submitToGoogleSheets(updatedSession);
      
      if (success) {
        router.push('/success');
      } else {
        alert('Failed to submit your answers. Please try again.');
        setIsLoading(false);
      }
    } else {
      // Save session and go to next question
      saveSession(updatedSession);
      router.push(`/question/${questionId + 1}`);
    }
  };

  if (isLoading || !session || !currentQuestion || !currentTimer) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-700 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading question...</p>
        </div>
      </main>
    );
  }

  // Find existing answer if user is revisiting
  const existingAnswer = session.answers.find(a => a.questionId === questionId)?.answer || '';

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <ProgressBar
          current={questionId}
          total={totalQuestions}
          timers={session.questionTimers}
        />
        
        <QuestionCard
          question={currentQuestion}
          questionNumber={questionId}
          totalQuestions={totalQuestions}
          onSubmit={handleSubmit}
          onTimeUpdate={handleTimeUpdate}
          isLast={questionId === totalQuestions}
          timer={currentTimer}
          existingAnswer={existingAnswer}
        />

        {/* Navigation for previous questions */}
        {questionId > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.push(`/question/${questionId - 1}`)}
              className="text-sm text-zinc-600 hover:text-zinc-800 underline"
            >
              ← Go to previous question
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
