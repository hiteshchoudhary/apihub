import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(daysAgo / 365);

  if (yearsAgo >= 1) return `${yearsAgo}y`;
  if (monthsAgo >= 1) return `${monthsAgo}mo`;
  if (weeksAgo >= 1) return `${weeksAgo}w`;
  if (daysAgo >= 1) return `${daysAgo}d`;
  if (hoursAgo >= 1) return `${hoursAgo}h`;
  if (minutesAgo >= 1) return `${minutesAgo}m`;
  return `just now`;
}

export function formatDateMathYearDay(dateString: string): string {
  const date = new Date(dateString);

  // Extract hours, minutes, and AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Get month name
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];

  // Format the date
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm} · ${month} ${day}, ${year}`;
}


export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};