/**
 * Date and time utility functions
 */

/**
 * Format a date as a localized string
 */
export function formatLocalizedDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format time as HH:mm
 */
export function formatTime(date: Date): string {
  return date.toTimeString().substring(0, 5);
}

/**
 * Format date as day name (e.g., "Montag")
 */
export function formatDayName(date: Date, locale: string = 'de-DE'): string {
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/**
 * Format date as "Heute", "Morgen", or day name
 */
export function formatRelativeDay(date: Date, locale: string = 'de-DE'): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return getTodayWord(locale);
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return getTomorrowWord(locale);
  } else {
    return formatDayName(date, locale);
  }
}

/**
 * Get localized "Today" word
 */
function getTodayWord(locale: string): string {
  const words: Record<string, string> = {
    'de': 'Heute',
    'de-DE': 'Heute',
    'it': 'Oggi',
    'it-IT': 'Oggi',
    'en': 'Today',
    'en-US': 'Today',
    'en-GB': 'Today',
    'ld': 'Unc'
  };
  
  return words[locale] || 'Today';
}

/**
 * Get localized "Tomorrow" word
 */
function getTomorrowWord(locale: string): string {
  const words: Record<string, string> = {
    'de': 'Morgen',
    'de-DE': 'Morgen',
    'it': 'Domani',
    'it-IT': 'Domani',
    'en': 'Tomorrow',
    'en-US': 'Tomorrow',
    'en-GB': 'Tomorrow',
    'ld': 'Doman'
  };
  
  return words[locale] || 'Tomorrow';
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getDate() === tomorrow.getDate() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getFullYear() === tomorrow.getFullYear();
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Get time difference in human readable format
 */
export function getTimeDifference(from: Date, to: Date): string {
  const diffMs = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'Tag' : 'Tage'}`;
  } else if (diffHrs > 0) {
    return `${diffHrs} ${diffHrs === 1 ? 'Stunde' : 'Stunden'}`;
  } else {
    return `${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`;
  }
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}