import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export function formatDate(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

export function formatTime(dateString: string | Date): string {
  let date: Date;

  if (typeof dateString === 'string') {
    date = new Date(dateString);
  } else {
    date = dateString;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${period}`;
}
export function getMediaType(extension: string) {
  return extension.match(/(avi|mp4|webm)/) ? 'video' : 'image';
}
