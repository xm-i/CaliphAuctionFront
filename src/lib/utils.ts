import type { ClassValue } from "clsx";
import type { Ref } from "vue";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Lightweight "Updater" utility type compatible with TanStack's pattern
type UpdaterOrValue<T> = T | ((old: T) => T);

export function valueUpdater<T>(
  updaterOrValue: UpdaterOrValue<T>,
  ref: Ref<T>
) {
  ref.value = (
    typeof updaterOrValue === "function"
      ? (updaterOrValue as (old: T) => T)(ref.value)
      : updaterOrValue
  ) as T;
}

export function numberWithComma(value: number): string {
  return value.toLocaleString();
}

export function isValidCardNumber(raw: string): boolean {
  const cleaned = raw.replace(/[^0-9]/g, "");
  if (cleaned.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}
