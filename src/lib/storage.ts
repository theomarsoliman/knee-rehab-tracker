import { AppSettings, ConditionId, DailyROM, PainEntry, SessionLog } from '@/types';

const KEYS = {
  SETTINGS: 'knee-rehab-settings',
  SESSIONS: 'knee-rehab-sessions',
  ROM_ENTRIES: 'knee-rehab-rom',
  PAIN_ENTRIES: 'knee-rehab-pain',
  REMINDERS: 'knee-rehab-reminders',
};

const DEFAULT_START_DATE = '2026-04-24';
const DEFAULT_INJURY_DATE = '2025-12-24';

// Returns the given date offset by N months, as YYYY-MM-DD.
const shiftMonths = (isoDate: string, months: number): string => {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

const VALID_CONDITIONS: ConditionId[] = [
  'general',
  'acl',
  'mcl',
  'pcl',
  'meniscus',
  'patellar',
  'post-surgical',
];

const normalizeCondition = (value: unknown): ConditionId => {
  return typeof value === 'string' && (VALID_CONDITIONS as string[]).includes(value)
    ? (value as ConditionId)
    : 'general';
};

export const getSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    return {
      startDate: DEFAULT_START_DATE,
      injuryDate: DEFAULT_INJURY_DATE,
      notificationsEnabled: false,
      condition: 'general',
    };
  }
  const stored = localStorage.getItem(KEYS.SETTINGS);
  if (stored) {
    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    // Graceful migration: if existing user has startDate but no injuryDate,
    // default injuryDate to (startDate minus 4 months) so it reads as "~4 months ago".
    const startDate = parsed.startDate ?? DEFAULT_START_DATE;
    const injuryDate = parsed.injuryDate ?? shiftMonths(startDate, -4);
    return {
      startDate,
      injuryDate,
      notificationsEnabled: parsed.notificationsEnabled ?? false,
      condition: normalizeCondition(parsed.condition),
    };
  }
  return {
    startDate: DEFAULT_START_DATE,
    injuryDate: DEFAULT_INJURY_DATE,
    notificationsEnabled: false,
    condition: 'general',
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSessions = (): SessionLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveSession = (session: SessionLog): void => {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex((s) => s.date === session.date);
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

  // Also update pain entries
  const painEntries = getPainEntries();
  const painIndex = painEntries.findIndex((p) => p.date === session.date);
  if (painIndex >= 0) {
    painEntries[painIndex] = { date: session.date, painBefore: session.painBefore, painAfter: session.painAfter };
  } else {
    painEntries.push({ date: session.date, painBefore: session.painBefore, painAfter: session.painAfter });
  }
  localStorage.setItem(KEYS.PAIN_ENTRIES, JSON.stringify(painEntries));

  // Update ROM entry
  const romEntries = getROMEntries();
  const romIndex = romEntries.findIndex((r) => r.date === session.date);
  if (romIndex >= 0) {
    romEntries[romIndex] = { date: session.date, rom: session.rom };
  } else {
    romEntries.push({ date: session.date, rom: session.rom });
  }
  localStorage.setItem(KEYS.ROM_ENTRIES, JSON.stringify(romEntries));
};

export const getROMEntries = (): DailyROM[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(KEYS.ROM_ENTRIES);
  return stored ? JSON.parse(stored) : [];
};

export const saveROMEntry = (entry: DailyROM): void => {
  const entries = getROMEntries();
  const index = entries.findIndex((e) => e.date === entry.date);
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(KEYS.ROM_ENTRIES, JSON.stringify(entries));
};

export const getPainEntries = (): PainEntry[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(KEYS.PAIN_ENTRIES);
  return stored ? JSON.parse(stored) : [];
};

export const getTodayString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getStreak = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map((s) => s.date)
    .sort()
    .reverse();

  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  // Check if today or yesterday has a session
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!sortedDates.includes(todayStr) && !sortedDates.includes(yesterdayStr)) {
    return 0;
  }

  // Start from today or yesterday depending on what's in the log
  if (!sortedDates.includes(todayStr)) {
    checkDate = yesterday;
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const hasLoggedToday = (): boolean => {
  const today = getTodayString();
  const sessions = getSessions();
  return sessions.some((s) => s.date === today);
};

export const getTodaySession = (): SessionLog | null => {
  const today = getTodayString();
  const sessions = getSessions();
  return sessions.find((s) => s.date === today) || null;
};

export const resetAllData = (): void => {
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.SESSIONS);
  localStorage.removeItem(KEYS.ROM_ENTRIES);
  localStorage.removeItem(KEYS.PAIN_ENTRIES);
  localStorage.removeItem(KEYS.REMINDERS);
};
