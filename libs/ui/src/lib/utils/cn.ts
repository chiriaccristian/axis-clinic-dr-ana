export type ClassValue = string | false | null | undefined;

/** Joins conditional class names, keeping Tailwind class lists readable. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
