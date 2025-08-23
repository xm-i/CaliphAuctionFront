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
