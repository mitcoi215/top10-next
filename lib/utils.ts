// 📍 File: D:\top10-next\lib\utils.ts
// 🎯 Mục đích: Helper functions dùng chung

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 🎨 Merge Tailwind classes thông minh
 * Tránh conflict khi có nhiều className trùng prefix
 * VD: cn('px-2', 'px-4') → 'px-4' (px-4 ghi đè px-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ⭐ Format rating về 1 chữ số thập phân
 * VD: formatRating(4.567) → "4.6"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * 💰 Format giá tiền
 * VD: formatPrice(9.99) → "$9.99"
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * 🔗 Tạo slug từ string (dùng cho URL)
 * VD: generateSlug("Web Hosting Services") → "web-hosting-services"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * 📅 Format date
 * VD: formatDate("2025-01-01") → "January 1, 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * ✂️ Cắt ngắn text
 * VD: truncate("Very long text...", 20) → "Very long text..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}