export type Phase = 1 | 2 | 3 | 4;

export interface Exercise {
  id: string;
  name: string;
  phase: Phase;
  sets: number;
  reps: string;
  instructions: string;
  whatToAvoid: string;
  icon: string;
}

export interface SessionLog {
  date: string; // YYYY-MM-DD
  phase: Phase;
  exercises: {
    id: string;
    completed: boolean;
  }[];
  painBefore: number;
  painAfter: number;
  notes: string;
  rom: number;
  timestamp: number;
}

export interface DailyROM {
  date: string;
  rom: number;
}

export interface PainEntry {
  date: string;
  painBefore: number;
  painAfter: number;
}

export type ConditionId =
  | 'general'
  | 'acl'
  | 'mcl'
  | 'pcl'
  | 'meniscus'
  | 'patellar'
  | 'post-surgical';

export interface AppSettings {
  startDate: string; // YYYY-MM-DD, program start date (anchor for phase math)
  injuryDate: string; // YYYY-MM-DD, cosmetic/historical only, NOT used for phase math
  notificationsEnabled: boolean;
  condition: ConditionId;
}
