
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with appropriate precision
export function formatPrice(price: number): string {
  if (price < 0.1) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 1000) return price.toFixed(2);
  if (price < 10000) return price.toFixed(1);
  return price.toFixed(0);
}

// Format percentage for display
export function formatPercentage(percentage: number): string {
  return percentage.toFixed(2) + '%';
}

// Get current month name
export function getCurrentMonthName(): string {
  const date = new Date();
  return date.toLocaleString('default', { month: 'long' });
}

// Convert timestamp to human-readable date
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

// Get month name from month number (1-12)
export function getMonthName(month: number): string {
  const date = new Date(2000, month - 1, 1);
  return date.toLocaleString('default', { month: 'long' });
}

// Get color class based on signal status
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'WAITING':
      return 'text-yellow-400';
    case 'ENTRY_HIT':
      return 'text-green-400';
    case 'ACTIVE':
      return 'text-blue-400';
    case 'TP_HIT':
      return 'text-purple-400';
    case 'SL_HIT':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

// Get emoji based on signal status
export function getStatusEmoji(status: string): string {
  switch (status) {
    case 'WAITING':
      return '🟡';
    case 'ENTRY_HIT':
      return '🟢';
    case 'ACTIVE':
      return '🔵';
    case 'TP_HIT':
      return '🟣';
    case 'SL_HIT':
      return '🔴';
    default:
      return '⚪';
  }
}
