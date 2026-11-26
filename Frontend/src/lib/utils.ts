import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns custom avatar initials according to format:
 * - First and last name first letter string (e.g. "Chef Rajinder Maharaj" -> "CM", "Rameshwar Singh" -> "RS").
 * - If there is no last name, first two characters of first word (e.g. "Prateek" -> "PR").
 */
export function getNameInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  const firstChar = words[0][0];
  const lastChar = words[words.length - 1][0];
  return (firstChar + lastChar).toUpperCase();
}

