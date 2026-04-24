export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDaysSince = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

// Human-readable "time since injury" string.
// Uses days under 14, weeks under 8, otherwise months.
export const getTimeSinceInjury = (injuryDate: string): string => {
  const days = getDaysSince(injuryDate);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day since injury';
  if (days < 14) return `${days} days since injury`;
  if (days < 56) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} since injury`;
  }
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} since injury`;
};

export const getPhaseProgress = (startDate: string): { current: number; total: number; percentage: number } => {
  const days = getDaysSince(startDate);
  const total = 84;
  const percentage = Math.min(100, Math.max(0, (days / total) * 100));
  return { current: days, total, percentage };
};

export const getPainLabel = (pain: number): string => {
  if (pain === 0) return 'None';
  if (pain <= 2) return 'Mild';
  if (pain <= 4) return 'Moderate';
  if (pain <= 6) return 'Notable';
  if (pain <= 8) return 'Severe';
  return 'Extreme';
};

export const getPainColor = (pain: number): string => {
  if (pain <= 2) return 'var(--accent)';
  if (pain <= 4) return 'var(--accent-2)';
  if (pain <= 6) return 'var(--amber)';
  return 'var(--warn)';
};
