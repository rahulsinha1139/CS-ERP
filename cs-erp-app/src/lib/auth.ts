/**
 * Authentication Library - Custom Simple Auth
 * Secure session-based authentication for CS ERP System
 *
 * Features:
 * - HTTP-only secure cookies
 * - bcrypt password hashing
 * - Session management with iron-session
 * - Rate limiting ready
 */

import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

/**
 * Session Data Structure
 */
export interface SessionData {
  userId: string;
  email: string;
  companyId: string;
  isAuthenticated: boolean;
  loginTime?: number;
  lastActivity?: number;
}

/**
 * Iron Session Configuration
 *
 * Security Settings:
 * - HTTP-only cookies (no JavaScript access)
 * - Secure flag (HTTPS only in production)
 * - SameSite strict (CSRF protection)
 * - 7-day expiration
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long_for_security',
  cookieName: 'cs_erp_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};

/**
 * Default Admin User
 * In production, this should be stored in database
 * For single-user system, hardcoded credentials are acceptable
 */
const ADMIN_USER = {
  id: 'user_admin_001',
  email: 'admin@pragnyapradhan.com',
  // Password: "AuntyHere'sYourApp@123"
  // Hashed with bcrypt (12 rounds)
  passwordHash: '$2a$12$qSzwpfWne45.sGdT19AuEedwclslKPu2bchWJO5chfAtdUGZ7EnzW',
  companyId: 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b', // Actual UUID from database
  name: 'Pragnya Pradhan',
};

/**
 * Get current session - Pages Router compatible
 * @returns Session data or null if not authenticated
 */
export async function getSession(req?: any, res?: any): Promise<SessionData | null> {
  let session: any;

  // If req/res provided (Pages Router - tRPC/API routes), use them directly
  if (req && res) {
    session = await getIronSession<SessionData>(req, res, sessionOptions);
  } else {
    // Fallback to cookies() for App Router (Server Components)
    const cookieStore = await cookies();
    session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  }

  if (!session.isAuthenticated) {
    return null;
  }

  // Check session expiry (auto-logout after 7 days of inactivity)
  if (session.lastActivity) {
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - session.lastActivity > sevenDaysMs) {
      await destroySession(req, res);
      return null;
    }
  }

  // Update last activity timestamp
  session.lastActivity = Date.now();
  await session.save();

  return session;
}

/**
 * Create new session (login) - Pages Router compatible
 * For use in API routes with req/res
 */
export async function createSession(userId: string, email: string, companyId: string, req?: any, res?: any): Promise<void> {
  // If req/res provided (Pages Router API route), use them directly
  if (req && res) {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    session.userId = userId;
    session.email = email;
    session.companyId = companyId;
    session.isAuthenticated = true;
    session.loginTime = Date.now();
    session.lastActivity = Date.now();
    await session.save();
  } else {
    // Fallback to cookies() for App Router (Server Components)
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.userId = userId;
    session.email = email;
    session.companyId = companyId;
    session.isAuthenticated = true;
    session.loginTime = Date.now();
    session.lastActivity = Date.now();
    await session.save();
  }
}

/**
 * Destroy session (logout) - Pages Router compatible
 */
export async function destroySession(req?: any, res?: any): Promise<void> {
  // If req/res provided (Pages Router API route), use them directly
  if (req && res) {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    session.destroy();
  } else {
    // Fallback to cookies() for App Router
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.destroy();
  }
}

/**
 * Verify login credentials
 * @returns User data if valid, null if invalid
 */
export async function verifyCredentials(email: string, password: string): Promise<{
  id: string;
  email: string;
  companyId: string;
  name: string;
} | null> {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email matches admin user
  if (normalizedEmail !== ADMIN_USER.email.toLowerCase()) {
    return null;
  }

  // Verify password against stored hash
  const isValid = await bcrypt.compare(password, ADMIN_USER.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    id: ADMIN_USER.id,
    email: ADMIN_USER.email,
    companyId: ADMIN_USER.companyId,
    name: ADMIN_USER.name,
  };
}

/**
 * Require authentication (for server components/actions)
 * Throws error if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized - Please login');
  }

  return session;
}

/**
 * Check if user is authenticated (boolean)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Get current user ID (for convenience)
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * Get current company ID (for convenience)
 */
export async function getCurrentCompanyId(): Promise<string | null> {
  const session = await getSession();
  return session?.companyId || null;
}

/**
 * Rate Limiting Helper (basic implementation)
 * In production, use Redis or similar for distributed rate limiting
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (attempt.count >= maxAttempts) {
    return false;
  }

  attempt.count++;
  return true;
}

export function resetRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}
