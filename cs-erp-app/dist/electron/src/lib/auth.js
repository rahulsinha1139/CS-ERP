"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionOptions = void 0;
exports.getSession = getSession;
exports.createSession = createSession;
exports.destroySession = destroySession;
exports.verifyCredentials = verifyCredentials;
exports.requireAuth = requireAuth;
exports.isAuthenticated = isAuthenticated;
exports.getCurrentUserId = getCurrentUserId;
exports.getCurrentCompanyId = getCurrentCompanyId;
exports.checkRateLimit = checkRateLimit;
exports.resetRateLimit = resetRateLimit;
const iron_session_1 = require("iron-session");
const headers_1 = require("next/headers");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Iron Session Configuration
 *
 * Security Settings:
 * - HTTP-only cookies (no JavaScript access)
 * - Secure flag (HTTPS only in production)
 * - SameSite strict (CSRF protection)
 * - 7-day expiration
 */
exports.sessionOptions = {
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
async function getSession(req, res) {
    let session;
    // If req/res provided (Pages Router - tRPC/API routes), use them directly
    if (req && res) {
        session = await (0, iron_session_1.getIronSession)(req, res, exports.sessionOptions);
    }
    else {
        // Fallback to cookies() for App Router (Server Components)
        const cookieStore = await (0, headers_1.cookies)();
        session = await (0, iron_session_1.getIronSession)(cookieStore, exports.sessionOptions);
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
async function createSession(userId, email, companyId, req, res) {
    // If req/res provided (Pages Router API route), use them directly
    if (req && res) {
        const session = await (0, iron_session_1.getIronSession)(req, res, exports.sessionOptions);
        session.userId = userId;
        session.email = email;
        session.companyId = companyId;
        session.isAuthenticated = true;
        session.loginTime = Date.now();
        session.lastActivity = Date.now();
        await session.save();
    }
    else {
        // Fallback to cookies() for App Router (Server Components)
        const cookieStore = await (0, headers_1.cookies)();
        const session = await (0, iron_session_1.getIronSession)(cookieStore, exports.sessionOptions);
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
async function destroySession(req, res) {
    // If req/res provided (Pages Router API route), use them directly
    if (req && res) {
        const session = await (0, iron_session_1.getIronSession)(req, res, exports.sessionOptions);
        session.destroy();
    }
    else {
        // Fallback to cookies() for App Router
        const cookieStore = await (0, headers_1.cookies)();
        const session = await (0, iron_session_1.getIronSession)(cookieStore, exports.sessionOptions);
        session.destroy();
    }
}
/**
 * Verify login credentials
 * @returns User data if valid, null if invalid
 */
async function verifyCredentials(email, password) {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    // Check if email matches admin user
    if (normalizedEmail !== ADMIN_USER.email.toLowerCase()) {
        return null;
    }
    // Verify password against stored hash
    const isValid = await bcryptjs_1.default.compare(password, ADMIN_USER.passwordHash);
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
async function requireAuth() {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized - Please login');
    }
    return session;
}
/**
 * Check if user is authenticated (boolean)
 */
async function isAuthenticated() {
    const session = await getSession();
    return session !== null;
}
/**
 * Get current user ID (for convenience)
 */
async function getCurrentUserId() {
    const session = await getSession();
    return session?.userId || null;
}
/**
 * Get current company ID (for convenience)
 */
async function getCurrentCompanyId() {
    const session = await getSession();
    return session?.companyId || null;
}
/**
 * Rate Limiting Helper (basic implementation)
 * In production, use Redis or similar for distributed rate limiting
 */
const loginAttempts = new Map();
function checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
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
function resetRateLimit(identifier) {
    loginAttempts.delete(identifier);
}
