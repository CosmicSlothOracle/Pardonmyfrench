import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  isActive: boolean;
  onTimeUpdate: (seconds: number) => void;
  onFocusLost: () => void;
  onCompletionTimeAnalysis?: (totalTime: number, averageTimePerGap: number) => void;
  totalGaps?: number;
  maxTimeMinutes?: number; // Maximum time in minutes (auto-submit when reached)
  onTimeExpired?: () => void; // Callback when time expires
  startTimestamp?: number; // Optional absolute start time for resumable exams
}

export const Timer: React.FC<TimerProps> = ({ isActive, onTimeUpdate, onFocusLost, onCompletionTimeAnalysis, totalGaps, maxTimeMinutes, onTimeExpired, startTimestamp }) => {
  const [seconds, setSeconds] = useState(0);
  const startTime = useRef<number | null>(null);
  // Using 'any' to avoid "Cannot find namespace 'NodeJS'" error if @types/node is missing,
  // and to support both browser (number) and other environment return types for setInterval.
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onFocusLost();
      } else if (isActive) {
        startTimer();
      }
    };

    const startTimer = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!startTime.current) {
        startTime.current = Date.now();
      }
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newValue = startTimestamp
            ? Math.floor((Date.now() - startTimestamp) / 1000)
            : prev + 1;
          onTimeUpdate(newValue);

          // Check if time limit reached
          if (maxTimeMinutes && onTimeExpired) {
            const maxSeconds = maxTimeMinutes * 60;
            if (newValue >= maxSeconds) {
              clearInterval(intervalRef.current);
              onTimeExpired();
            }
          }

          return newValue;
        });
      }, 1000);
    };

    if (isActive) {
      startTimer();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Analyze completion time when test ends
      if (startTime.current && onCompletionTimeAnalysis && totalGaps) {
        const totalTime = seconds;
        const averageTimePerGap = totalGaps > 0 ? totalTime / totalGaps : 0;
        onCompletionTimeAnalysis(totalTime, averageTimePerGap);
      }
      startTime.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, onFocusLost, onTimeUpdate, startTimestamp]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (startTimestamp !== undefined) {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      setSeconds(elapsed);
      onTimeUpdate(elapsed);
    }
  }, [startTimestamp, onTimeUpdate]);

  const maxSeconds = maxTimeMinutes ? maxTimeMinutes * 60 : null;
  const timeRemaining = maxSeconds ? maxSeconds - seconds : null;
  const isWarning = maxSeconds && seconds >= maxSeconds * 0.8; // Warning at 80% of time
  const isCritical = maxSeconds && seconds >= maxSeconds * 0.95; // Critical at 95% of time

  return (
    <div className={`font-mono text-xl font-bold px-4 py-2 rounded shadow-sm border-2 ${
      isActive
        ? isCritical
          ? 'bg-red-100 text-red-700 border-red-500'
          : isWarning
            ? 'bg-yellow-100 text-yellow-700 border-yellow-500'
            : 'bg-white text-blue-600 border-blue-200'
        : 'bg-gray-100 text-gray-400 border-gray-200'
    }`}>
      <i className="fas fa-stopwatch mr-2"></i>
      {formatTime(seconds)}
      {maxTimeMinutes && timeRemaining !== null && timeRemaining > 0 && (
        <span className="ml-3 text-sm font-normal">
          ({formatTime(timeRemaining)} remaining)
        </span>
      )}
      {maxTimeMinutes && timeRemaining !== null && timeRemaining <= 0 && (
        <span className="ml-3 text-sm font-normal text-red-600">
          TIME EXPIRED
        </span>
      )}
    </div>
  );
};