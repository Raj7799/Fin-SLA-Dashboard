/**
 * Formats minutes from midnight into a standard AM/PM clock time string in EST.
 * e.g., 442 -> "07:22 AM EST" or "7:22 AM"
 */
export function formatMinutesToTime(minutes, includeTimeZone = false) {
  if (minutes === null || minutes === undefined) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const displayMins = String(mins).padStart(2, '0');
  const timeStr = `${displayHrs}:${displayMins} ${ampm}`;
  return includeTimeZone ? `${timeStr} EST` : timeStr;
}

/**
 * Formats variance in minutes (positive is delayed, negative is early).
 * e.g., -38 -> "-38 mins" or "+15 mins"
 */
export function formatVariance(varianceMinutes) {
  if (varianceMinutes === null || varianceMinutes === undefined) return 'N/A';
  if (varianceMinutes === 0) return 'On Time';
  return varianceMinutes > 0 ? `+${varianceMinutes} min` : `${varianceMinutes} min`;
}

/**
 * Formats dates (YYYY-MM-DD) into a cleaner presentation format.
 * e.g., "2026-08-03" -> "Aug 3, 2026"
 */
export function formatDate(dateStr, short = false) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  if (short) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Formats values with commas for readability.
 * e.g. 1245 -> "1,245"
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a percentage.
 * e.g. 95.823 -> "95.8%"
 */
export function formatPercentage(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}
