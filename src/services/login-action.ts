'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '../lib/dashboard-auth';

export type LoginState = { error?: string } | undefined;

// useActionState requires: (prevState, formData) => State
export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const rawFrom = formData.get('from')?.toString() || '/dashboard';

  // Prevent Open Redirect: only allow internal relative paths, never protocol-relative or absolute URLs
  const safeFrom =
    rawFrom.startsWith('/') && !rawFrom.startsWith('//') && !rawFrom.includes('\\')
      ? rawFrom
      : '/dashboard';

  const validEmail = process.env.DASHBOARD_EMAIL;
  const validPassword = process.env.DASHBOARD_PASSWORD;

  if (!validEmail || !validPassword) {
    return {
      error: 'Server is not configured. Set DASHBOARD_EMAIL and DASHBOARD_PASSWORD in .env.local.',
    };
  }

  if (email !== validEmail || password !== validPassword) {
    return { error: 'Invalid email or password.' };
  }

  const sessionToken = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  redirect(safeFrom);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/login');
}
