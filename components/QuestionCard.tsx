'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Timer } from './Timer';
import { cn } from '@/lib/utils';
import { Question, QuestionTimer } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string, timeSpent: number) => void;
  onTimeUpdate: (timeRemaining: number) => void;
  isLast: boolean;
  timer: QuestionTimer;
  existingAnswer?: string;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onSubmit,
  onTimeUpdate,
  isLast,
  timer,
  existingAnswer = ''
}: QuestionCardProps) {
  const [answer, setAnswer] = useState(existingAnswer);
  const [startTime] = useState(timer.startTime || Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isExpired = timer.isExpired || timer.timeRemaining <= 0;

  // Restore existing answer when component mounts
  useEffect(() => {
    setAnswer(existingAnswer);
  }, [existingAnswer]);

  const handleSubmit = async () => {
    if (isExpired || isSubmitting) return;
    
    setIsSubmitting(true);
    const timeSpent = question.timeLimit - timer.timeRemaining;
    await onSubmit(answer, timeSpent);
  };

  const handleTimeUp = () => {
    if (!isSubmitting && !isExpired) {
      handleSubmit();
    }
  };

  // Auto-focus textarea when component mounts
  useEffect(() => {
    const textarea = document.getElementById('answer-textarea');
    if (textarea) {
      textarea.focus();
    }
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardDescription>
              {question.category} • {question.level}
            </CardDescription>
            <CardTitle className="text-xl font-semibold">
              Question {questionNumber} of {totalQuestions}
            </CardTitle>
          </div>
          <Timer
            initialTime={timer.timeRemaining}
            onTimeUp={handleTimeUp}
            onTimeUpdate={onTimeUpdate}
            isActive={!isSubmitting && !isExpired}
            isExpired={isExpired}
            className="flex-shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-800 leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="answer-textarea" className="text-base font-medium">
              Your Answer
            </Label>
            {isExpired && (
              <span className="text-sm text-red-600 font-medium">Time Expired</span>
            )}
          </div>
          <textarea
            id="answer-textarea"
            className={cn(
              "w-full min-h-[200px] p-4 rounded-lg border",
              "focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent",
              "resize-none text-base leading-relaxed",
              "placeholder:text-zinc-400",
              isExpired ? "bg-red-50 border-red-200 cursor-not-allowed text-zinc-600" :
              isSubmitting ? "bg-zinc-50 border-zinc-200 cursor-not-allowed" : 
              "border-zinc-200"
            )}
            placeholder={isExpired ? "Time expired - Answer cannot be modified" : "Type your answer here..."}
            value={answer}
            onChange={(e) => !isExpired && setAnswer(e.target.value)}
            disabled={isSubmitting || isExpired}
            readOnly={isExpired}
          />
          <p className="text-sm text-zinc-500">
            {answer.length} characters
          </p>
        </div>

        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-zinc-500">
            {isLast ? 'This is the final question' : `${totalQuestions - questionNumber} questions remaining`}
          </p>
          {isExpired ? (
            <div className="flex gap-2">
              <span className="text-sm text-red-600 font-medium self-center">Time Expired</span>
              {!isLast && (
                <Button
                  onClick={() => window.location.href = `/question/${questionNumber + 1}`}
                  size="lg"
                  variant="outline"
                  className="min-w-[150px]"
                >
                  Next Question →
                </Button>
              )}
              {isLast && (
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  variant="outline"
                  className="min-w-[150px]"
                >
                  Finish Interview
                </Button>
              )}
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              size="lg"
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Submitting...' : 
               isLast ? 'Finish Interview' : 'Next Question'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
