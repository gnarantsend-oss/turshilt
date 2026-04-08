import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui-д шаардлагатай className нэгтгэх utility.
 * clsx + tailwind-merge хослол.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
