'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createNewSession, saveSession } from '@/lib/api';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Create a new session
    const session = createNewSession(email);
    saveSession(session);
    
    // Navigate to the first question
    router.push('/question/1');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">React & Tailwind Screening</CardTitle>
        <CardDescription>
          Welcome to the technical screening interview. You'll answer 10 questions with time limits for each.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>
          
          <div className="bg-zinc-50 p-4 rounded-lg space-y-2 text-sm text-zinc-600">
            <h3 className="font-semibold text-zinc-700">Instructions:</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>You'll answer 10 questions total</li>
              <li>React questions: 4 minutes each</li>
              <li>Tailwind questions: 3 minutes each</li>
              <li>Timer starts automatically for each question</li>
              <li>Questions auto-submit when time expires</li>
              <li>You cannot go back to previous questions</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Interview'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
