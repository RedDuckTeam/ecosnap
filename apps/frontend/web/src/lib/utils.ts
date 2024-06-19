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

export function getMediaType(extension: string) {
  return extension.match(/(avi|mp4|webm)/) ? 'video' : 'image';
}
