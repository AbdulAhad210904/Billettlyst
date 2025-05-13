export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('nb-NO', options);
}

export function formatDateTime(dateString: string, timeString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const dateTime = new Date(`${dateString}T${timeString}`);
  return dateTime.toLocaleDateString('nb-NO', options);
}