/**
 * validate-email.ts
 *
 * Two-layer email validation:
 *  Layer 1 — Disposable / throwaway email domain blocklist (via disposable-email-domains package)
 *  Layer 2 — MX record DNS lookup (verifies domain can actually receive mail)
 *
 * Runs server-side only (uses Node.js `dns` module).
 */

import { promises as dns } from 'dns';
import disposableDomains from 'disposable-email-domains';

const DISPOSABLE_DOMAINS_SET = new Set<string>(disposableDomains);

// ─── Layer 1: Disposable domain check ───────────────────────────────────────
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return true; // malformed
  return DISPOSABLE_DOMAINS_SET.has(domain);
}

// ─── Layer 2: MX Record DNS check ────────────────────────────────────────────
/**
 * Returns true when the domain has at least one MX record,
 * i.e. it is configured to receive email.
 * Caches results in a module-level Map to avoid redundant DNS queries.
 */
const mxCache = new Map<string, { result: boolean; ts: number }>();
const MX_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function hasMxRecord(email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;

  // Cache hit
  const cached = mxCache.get(domain);
  if (cached && Date.now() - cached.ts < MX_CACHE_TTL_MS) {
    return cached.result;
  }

  try {
    const records = await dns.resolveMx(domain);
    const result = Array.isArray(records) && records.length > 0;
    mxCache.set(domain, { result, ts: Date.now() });
    return result;
  } catch {
    // ENOTFOUND, ENODATA, ENORECORD etc. → domain doesn't exist or has no MX
    mxCache.set(domain, { result: false, ts: Date.now() });
    return false;
  }
}

// ─── Combined validator ───────────────────────────────────────────────────────
export type EmailValidationResult =
  | { valid: true }
  | { valid: false; reason: 'disposable' | 'no_mx' | 'format' };

export async function validateSubscriberEmail(email: string): Promise<EmailValidationResult> {
  // Basic format check
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { valid: false, reason: 'format' };
  }

  // Layer 1: Disposable domain
  if (isDisposableEmail(email)) {
    return { valid: false, reason: 'disposable' };
  }

  // Layer 2: MX record — real mail server exists?
  const mx = await hasMxRecord(email);
  if (!mx) {
    return { valid: false, reason: 'no_mx' };
  }

  return { valid: true };
}

// ─── Human-readable error messages ───────────────────────────────────────────
export function emailValidationMessage(reason: 'disposable' | 'no_mx' | 'format'): string {
  switch (reason) {
    case 'disposable':
      return 'Temporary or disposable email addresses are not allowed. Please use a real email address.';
    case 'no_mx':
      return 'This email domain does not appear to be valid or does not accept emails. Please double-check your address.';
    case 'format':
      return 'Please provide a valid email address.';
  }
}
