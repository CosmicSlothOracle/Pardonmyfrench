export interface ClozeGap {
  id: number;
  originalWord: string; // The correct answer
  hint: string; // The infinitive or base form to show in brackets
  tense: string; // Expected tense
}

export interface ClozeSegment {
  type: 'text' | 'gap';
  content: string | ClozeGap;
}

export interface ExtraQuestion {
  question: string;
  answer: string;
}

export interface ExamSection {
  id: string;
  title: string;
  type: 'listening' | 'reading' | 'grammar' | 'writing';
  maxPoints: number;
  timeLimitMinutes?: number; // Optional time limit per section
  segments: ClozeSegment[];
  extraQuestion?: ExtraQuestion;
}

export interface GeneratedExercise {
  title: string;
  topic: string;
  segments: ClozeSegment[]; // Legacy: kept for backward compatibility
  difficulty: string;
  sourceUrl?: string; // If grounded from search
  extraQuestion?: ExtraQuestion;
  // New exam structure
  sections?: ExamSection[]; // Structured exam sections
  totalTimeMinutes?: number; // Total exam time limit
  totalPoints?: number; // Total points available
  gradeLevel?: string; // e.g., "9. Klasse", "10. Klasse"
  curriculum?: string; // e.g., "Brandenburg Lehrplan"
}

export interface UserAnswer {
  gapId: number;
  value: string;
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  WATCHING = 'WATCHING',
  TESTING = 'TESTING',
  RESULTS = 'RESULTS',
}

export interface SecurityIncident {
  timestamp: number;
  type: 'copy_attempt' | 'paste_attempt' | 'focus_lost' | 'devtools' | 'screenshot_attempt' | 'suspicious_shortcut';
  details: string;
}

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

export interface ExamScore {
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  grade?: string; // e.g., "1", "2", "3", "4", "5", "6" (German grading)
  sectionScores: {
    sectionId: string;
    maxPoints: number;
    earnedPoints: number;
  }[];
}