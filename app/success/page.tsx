'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadSession, clearSession } from '@/lib/api';
import { ScreeningSession } from '@/types';

export default function SuccessPage() {
  const router = useRouter();
  const [session, setSession] = useState<ScreeningSession | null>(null);

  useEffect(() => {
    const savedSession = loadSession();
    if (!savedSession || !savedSession.completed) {
      router.push('/');
      return;
    }
    setSession(savedSession);
  }, [router]);

  const handleNewSession = () => {
    clearSession();
    router.push('/');
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-700 mx-auto"></div>
        </div>
      </main>
    );
  }

  const totalTimeSpent = session.answers.reduce((total, answer) => total + answer.timeSpent, 0);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Interview Completed!</CardTitle>
          <CardDescription>
            Your responses have been successfully submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-zinc-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-600">Email:</span>
              <span className="font-medium">{session.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Questions answered:</span>
              <span className="font-medium">{session.answers.length} / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Total time:</span>
              <span className="font-medium">{formatTime(totalTimeSpent)}</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-600">
              Thank you for completing the screening interview. Your responses have been
              recorded and will be reviewed by our team.
            </p>
            <p className="text-sm text-zinc-600">
              We'll get back to you soon with the results.
            </p>
          </div>

          <Button
            onClick={handleNewSession}
            className="w-full"
            variant="outline"
          >
            Start New Interview
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
