export function formatDate(dateString: string | Date, locale = 'en-US'): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 mins';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
  }
  return `${remainingMins} mins`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function truncateText(text: string, maxLength = 60): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
