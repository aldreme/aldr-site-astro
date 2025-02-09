import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function productSlug(productName: string) {
  return productName.toLowerCase().replace(/\s+/g, "-")
}

export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}