import React, { useEffect, useRef, useCallback } from 'react';

export interface KeystrokeEvent {
  timestamp: number;
  key: string;
  keyCode: number;
  code: string;
  inputId?: number;
  inputValue: string;
  cursorPosition: number;
  isBackspace: boolean;
  isDelete: boolean;
  isEnter: boolean;
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    meta: boolean;
  };
  timeSinceLastKey: number;
}

export interface KeystrokeAnalysis {
  totalKeystrokes: number;
  wordsPerMinute: number;
  averagePauseDuration: number;
  backspaceCount: number;
  deleteCount: number;
  correctionFrequency: number;
  suspiciousPatterns: string[];
  timePerGap: Map<number, number>;
  typingSpeedVariations: number[];
}

interface KeystrokeLoggerProps {
  isActive: boolean;
  onLogUpdate: (events: KeystrokeEvent[], analysis: KeystrokeAnalysis) => void;
  currentInputId?: number;
}

export const KeystrokeLogger: React.FC<KeystrokeLoggerProps> = ({
  isActive,
  onLogUpdate,
  currentInputId
}) => {
  const keystrokeLog = useRef<KeystrokeEvent[]>([]);
  const lastKeyTime = useRef<number>(Date.now());
  const inputStartTimes = useRef<Map<number, number>>(new Map());

  const analyzeKeystrokes = useCallback((): KeystrokeAnalysis => {
    const events = keystrokeLog.current;
    if (events.length === 0) {
      return {
        totalKeystrokes: 0,
        wordsPerMinute: 0,
        averagePauseDuration: 0,
        backspaceCount: 0,
        deleteCount: 0,
        correctionFrequency: 0,
        suspiciousPatterns: [],
        timePerGap: new Map(),
        typingSpeedVariations: []
      };
    }

    const backspaceCount = events.filter(e => e.isBackspace).length;
    const deleteCount = events.filter(e => e.isDelete).length;
    const totalChars = events.filter(e => !e.isBackspace && !e.isDelete && !e.isEnter).length;

    // Calculate words per minute (approximate: 5 chars = 1 word)
    const totalTime = events[events.length - 1].timestamp - events[0].timestamp;
    const minutes = totalTime / 60000;
    const wordsPerMinute = minutes > 0 ? (totalChars / 5) / minutes : 0;

    // Calculate average pause duration
    const pauses = events
      .map(e => e.timeSinceLastKey)
      .filter(p => p > 0 && p < 10000); // Filter out extreme values
    const averagePauseDuration = pauses.length > 0
      ? pauses.reduce((a, b) => a + b, 0) / pauses.length
      : 0;

    // Calculate correction frequency
    const correctionFrequency = backspaceCount + deleteCount > 0
      ? (backspaceCount + deleteCount) / events.length
      : 0;

    // Detect suspicious patterns
    const suspiciousPatterns: string[] = [];

    // Check for unusually fast typing (potential copy-paste)
    const typingSpeeds = events
      .filter(e => !e.isBackspace && !e.isDelete)
      .map((e, i) => {
        if (i === 0) return 0;
        const prev = events[i - 1];
        return e.timestamp - prev.timestamp;
      })
      .filter(t => t > 0 && t < 1000);

    const avgTypingSpeed = typingSpeeds.length > 0
      ? typingSpeeds.reduce((a, b) => a + b, 0) / typingSpeeds.length
      : 0;

    if (avgTypingSpeed < 50 && typingSpeeds.length > 5) {
      suspiciousPatterns.push('Unusually fast typing detected (possible copy-paste)');
    }

    // Check for very long pauses (possible external help)
    const longPauses = pauses.filter(p => p > 5000);
    if (longPauses.length > 3) {
      suspiciousPatterns.push(`Multiple long pauses detected (${longPauses.length} pauses > 5s)`);
    }

    // Check for perfect typing (no corrections)
    if (backspaceCount === 0 && deleteCount === 0 && events.length > 20) {
      suspiciousPatterns.push('No corrections made (unusual for manual typing)');
    }

    // Calculate time per gap
    const timePerGap = new Map<number, number>();
    events.forEach(event => {
      if (event.inputId !== undefined) {
        const startTime = inputStartTimes.current.get(event.inputId) || event.timestamp;
        const timeSpent = event.timestamp - startTime;
        const current = timePerGap.get(event.inputId) || 0;
        timePerGap.set(event.inputId, Math.max(current, timeSpent));
      }
    });

    // Typing speed variations
    const typingSpeedVariations = typingSpeeds.length > 1
      ? typingSpeeds.map((speed, i) => {
          if (i === 0) return 0;
          const prev = typingSpeeds[i - 1];
          return Math.abs(speed - prev);
        })
      : [];

    return {
      totalKeystrokes: events.length,
      wordsPerMinute: Math.round(wordsPerMinute * 10) / 10,
      averagePauseDuration: Math.round(averagePauseDuration),
      backspaceCount,
      deleteCount,
      correctionFrequency: Math.round(correctionFrequency * 1000) / 10,
      suspiciousPatterns,
      timePerGap,
      typingSpeedVariations
    };
  }, []);

  const logKeystroke = useCallback((e: KeyboardEvent, inputElement: HTMLInputElement | HTMLTextAreaElement | null, inputId?: number) => {
    if (!isActive) return;

    const now = Date.now();
    const timeSinceLastKey = now - lastKeyTime.current;
    lastKeyTime.current = now;

    // Track input start time
    if (inputId !== undefined && !inputStartTimes.current.has(inputId)) {
      inputStartTimes.current.set(inputId, now);
    }

    const event: KeystrokeEvent = {
      timestamp: now,
      key: e.key,
      keyCode: e.keyCode || e.which,
      code: e.code,
      inputId: inputId !== undefined ? inputId : currentInputId,
      inputValue: inputElement?.value || '',
      cursorPosition: inputElement?.selectionStart || 0,
      isBackspace: e.key === 'Backspace',
      isDelete: e.key === 'Delete',
      isEnter: e.key === 'Enter',
      modifiers: {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey
      },
      timeSinceLastKey
    };

    keystrokeLog.current.push(event);

    // Limit log size to prevent memory issues (keep last 10000 events)
    if (keystrokeLog.current.length > 10000) {
      keystrokeLog.current = keystrokeLog.current.slice(-10000);
    }

    // Update analysis periodically
    const analysis = analyzeKeystrokes();
    onLogUpdate([...keystrokeLog.current], analysis);
  }, [isActive, currentInputId, analyzeKeystrokes, onLogUpdate]);

  useEffect(() => {
    if (!isActive) {
      keystrokeLog.current = [];
      inputStartTimes.current.clear();
      lastKeyTime.current = Date.now();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Find the active input element
      const activeElement = document.activeElement;
      let inputElement: HTMLInputElement | HTMLTextAreaElement | null = null;
      let inputId: number | undefined = undefined;

      if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
        inputElement = activeElement;
        // Try to extract input ID from data attribute or parent
        const dataId = inputElement.getAttribute('data-gap-id');
        if (dataId) {
          inputId = parseInt(dataId, 10);
        }
      }

      logKeystroke(e, inputElement, inputId);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, logKeystroke]);

  // Expose log for external access
  useEffect(() => {
    if (isActive) {
      (window as any).__keystrokeLog = keystrokeLog.current;
    }
  }, [isActive]);

  return null; // This component doesn't render anything
};
