import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE = 'dashboard_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecretKey(): string {
  const secret = process.env.SESSION_SECRET || process.env.DASHBOARD_PASSWORD;
  if (!secret) {
    return 'default-dashboard-portfolio-secret-salt-2026';
  }
  return secret;
}

/**
 * Creates a cryptographically signed session token: timestamp.signature
 */
export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const secret = getSecretKey();
  const signature = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Verifies that the session token was signed by the server and hasn't expired.
 */
export function verifySessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = Number(timestampStr);
  if (!timestamp || isNaN(timestamp)) return false;

  // Expire after 7 days
  const maxAgeMs = SESSION_MAX_AGE * 1000;
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  const secret = getSecretKey();
  const expectedSignature = crypto.createHmac('sha256', secret).update(timestampStr).digest('hex');

  try {
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Checks whether the incoming request cookie contains a valid, authenticated session.
 */
export async function isDashboardAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
