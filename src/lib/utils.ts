import type { envTypes } from "@/types/env.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility: Get supported MediaRecorder MIME type
export function getSupportedMimeType() {
  const types = [
    "audio/mp4", // iOS Safari
    "audio/mpeg", // mp3
    "audio/wav", // wav
    "audio/webm", // webm (default)
    "audio/ogg", // ogg
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "audio/webm";
}

// Helper to get Vite environment variables
export function getEnv(key: keyof envTypes, defaultValue?: string): string {
  const value = import.meta.env[key] ?? import.meta.env[`VITE_${key}`];
  if (value === undefined || value === null || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 * @param value - The JSON string to parse.
 * @param fallback - The value to return if parsing fails (default: null).
 * @returns The parsed object or the fallback value.
 *
 * @example
 * jsonSafeParse('{"a":1}') // { a: 1 }
 * jsonSafeParse('invalid', {}) // {}
 */
export function jsonSafeParse<T = unknown>(
  value: string,
  fallback: T | null = null
): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
