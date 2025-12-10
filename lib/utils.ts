import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilities for Finnhub news handling
export function getDateRange(days: number) {
  const to = new Date()
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const fmt = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
  return { from: fmt(from), to: fmt(to) }
}

export function validateArticle(a?: RawNewsArticle): a is RawNewsArticle {
  if (!a) return false
  if (!a.id && !a.url) return false
  if (!a.headline && !a.summary) return false
  if (!a.datetime || typeof a.datetime !== 'number') return false
  return true
}

export function formatArticle(a: RawNewsArticle, isCompany = false, symbol?: string, idx?: number): MarketNewsArticle {
  return {
    id: a.id || idx || 0,
    headline: a.headline || (a.summary ? a.summary.slice(0, 120) : ''),
    summary: a.summary || '',
    source: a.source || '',
    url: a.url || '',
    datetime: a.datetime || 0,
    category: a.category || '',
    related: symbol || a.related || '',
    image: a.image,
  }
}
