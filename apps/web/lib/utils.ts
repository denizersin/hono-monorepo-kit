import type { TErrorResponse } from "@repo/api-client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const isErrorResponse = (error: Error | TErrorResponse): error is TErrorResponse => {
  return 'success' in error
};



export const getFromLocalStorage = <T>(key: string): T | null => {
  if (!key || typeof window === 'undefined') {
    return null
  }
  const item = localStorage.getItem(key)
  if (!item) return null
  try {
    const parsedItem = JSON.parse(item) as T
    return parsedItem
  } catch (error) {
    console.error(error)
    return null
  }
}


export const setToLocalStorage = <T>(key: string, value: T) => {
  if (!key || typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

