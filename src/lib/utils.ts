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
