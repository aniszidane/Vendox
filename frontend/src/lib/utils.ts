// VendoX Frontend — lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ── Tailwind merge ────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Format price ──────────────────────────────────────────────────
export function formatPrice(amount: number, currency = 'DZD'): string {
  if (currency === 'DZD') {
    return `${amount.toLocaleString('fr-DZ')} DA`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// ── Format distance ───────────────────────────────────────────────
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

// ── Format number ─────────────────────────────────────────────────
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ── Truncate text ─────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

// ── Generate initials ─────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ── Slug from name ────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── Is valid URL ──────────────────────────────────────────────────
export function isValidUrl(url: string): boolean {
  try { new URL(url); return true; }
  catch { return false; }
}

// ── Debounce ──────────────────────────────────────────────────────
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Get avatar background from name ───────────────────────────────
export function getAvatarColor(name: string): string {
  const colors = [
    '#0D7490', '#0891B2', '#0E7490', '#155E75',
    '#E91E8C', '#AD1457', '#C2185B',
    '#1565C0', '#1976D2', '#0D47A1',
    '#2E7D32', '#388E3C',
    '#F57C00', '#FF6B35',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}
