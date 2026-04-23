export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
  const total = 84; // 12 weeks
  const percentage = Math.min(100, Math.max(0, (days / total) * 100));
  return { current: days, total, percentage };
};

export const getPainEmoji = (pain: number): string => {
  if (pain === 0) return '😌';
  if (pain <= 2) return '🙂';
  if (pain <= 4) return '😐';
  if (pain <= 6) return '😣';
  if (pain <= 8) return '😖';
  return '🤕';
};

export const getPainColor = (pain: number): string => {
  if (pain <= 2) return '#2D9B6A';
  if (pain <= 4) return '#84CC16';
  if (pain <= 6) return '#FBBF24';
  if (pain <= 8) return '#F97316';
  return '#EF4444';
};
