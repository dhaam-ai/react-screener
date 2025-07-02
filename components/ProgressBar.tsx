'use client';

import { cn } from '@/lib/utils';
import { QuestionTimer } from '@/types';

interface ProgressBarProps {
  current: number;
  total: number;
  timers?: QuestionTimer[];
  className?: string;
}

export function ProgressBar({ current, total, timers, className }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  const getQuestionStatus = (index: number) => {
    if (!timers) return 'not-started';
    
    const timer = timers[index];
    if (!timer) return 'not-started';
    
    if (!timer.hasBeenAccessed) return 'not-started';
    if (timer.isExpired || timer.timeRemaining <= 0) return 'expired';
    if (timer.timeRemaining <= 30) return 'warning';
    return 'active';
  };

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      switch (status) {
        case 'expired': return 'bg-red-500 scale-125';
        case 'warning': return 'bg-orange-500 scale-125 animate-pulse';
        case 'active': return 'bg-zinc-600 scale-125';
        default: return 'bg-zinc-400 scale-125';
      }
    }
    
    switch (status) {
      case 'expired': return 'bg-red-400';
      case 'warning': return 'bg-orange-400';
      case 'active': return 'bg-zinc-700';
      default: return 'bg-zinc-300';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
        <span className="font-medium">
          Question {current} of {total}
        </span>
        <span className="text-zinc-500">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-zinc-600 to-zinc-700 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        <div className="flex gap-1">
          {Array.from({ length: total }, (_, i) => {
            const status = getQuestionStatus(i);
            const isCurrent = i === current - 1;
            
            return (
              <div key={i} className="relative group">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    getStatusColor(status, isCurrent)
                  )}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Q{i + 1}: {status === 'expired' ? 'Expired' : 
                             status === 'warning' ? 'Low time' :
                             status === 'active' ? 'Active' : 'Not started'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-zinc-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          <span>Low time</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span>Expired</span>
        </div>
      </div>
    </div>
  );
}
