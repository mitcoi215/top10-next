// scripts/scraper/utils.ts
// Utility functions for scraper

/**
 * Convert string to camelCase
 * "Simple Setup" → "simpleSetup"
 * "Price per month" → "pricePerMonth"
 * "Types of Hosting Plans" → "typesOfHostingPlans"
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

/**
 * Convert string to slug
 * "Luis-santiago Saldivar" → "luis-santiago-saldivar"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Clean text: remove extra whitespace, trim
 */
export function cleanText(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Parse number from string
 * "9.4" → 9.4
 * "38,721 Reviews" → 38721
 */
export function parseNumber(str: string | null | undefined): number | null {
  if (!str) return null;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Log with timestamp
 */
export function log(message: string): void {
  const time = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${time}] ${message}`);
}

/**
 * Sleep for ms milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000,
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      const delay = baseDelay * Math.pow(2, i);
      log(`  Retry ${i + 1}/${maxRetries} in ${delay}ms: ${lastError.message}`);
      await sleep(delay);
    }
  }
  throw lastError;
}
