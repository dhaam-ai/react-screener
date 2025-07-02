'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  onTimeUpdate: (timeRemaining: number) => void;
  isActive: boolean;
  isExpired?: boolean;
  className?: string;
}

export function Timer({ 
  initialTime, 
  onTimeUp, 
  onTimeUpdate,
  isActive, 
  isExpired = false,
  className 
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [hasWarned, setHasWarned] = useState(false);
  const lastUpdateRef = useRef(timeRemaining);
  const onTimeUpCalledRef = useRef(false);

  // Update time when initialTime changes
  useEffect(() => {
    if (!isExpired) {
      setTimeRemaining(initialTime);
      lastUpdateRef.current = initialTime;
      onTimeUpCalledRef.current = false;
    } else {
      setTimeRemaining(0);
      lastUpdateRef.current = 0;
    }
  }, [initialTime, isExpired]);

  // Handle timer countdown - only depend on isActive and isExpired
  useEffect(() => {
    if (!isActive || isExpired) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        
        // Only update parent if time actually changed
        if (newTime !== lastUpdateRef.current) {
          lastUpdateRef.current = newTime;
          onTimeUpdate(newTime);
        }
        
        // Check if time is up
        if (newTime === 0 && !onTimeUpCalledRef.current) {
          onTimeUpCalledRef.current = true;
          onTimeUp();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isExpired, onTimeUpdate, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = initialTime > 0 ? (timeRemaining / initialTime) * 100 : 0;

  // Determine color based on time remaining
  const getColor = () => {
    if (timeRemaining <= 10) return 'text-red-600';
    if (timeRemaining <= 30) return 'text-orange-600';
    return 'text-zinc-700';
  };

  // Show warning at 30 seconds
  useEffect(() => {
    if (timeRemaining === 30 && !hasWarned && isActive) {
      setHasWarned(true);
    }
  }, [timeRemaining, hasWarned, isActive]);

  return (
    <div className={cn('relative w-32 h-32', className)}>
      {/* Background circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="60"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-zinc-200"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="60"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className={cn(
            'transition-all duration-300',
            timeRemaining <= 10 ? 'text-red-500' : 
            timeRemaining <= 30 ? 'text-orange-500' : 
            'text-zinc-600'
          )}
          strokeDasharray={`${2 * Math.PI * 60}`}
          strokeDashoffset={`${2 * Math.PI * 60 * (1 - percentage / 100)}`}
          strokeLinecap="round"
        />
      </svg>
      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn('text-2xl font-mono font-bold', getColor())}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {timeRemaining <= 30 && timeRemaining > 0 && (
            <div className="text-xs text-orange-600 font-medium animate-pulse">
              Hurry up!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
