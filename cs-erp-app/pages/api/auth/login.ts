/**
 * Login API Endpoint
 * POST /api/auth/login
 *
 * Body: { email: string, password: string }
 * Returns: { success: boolean, user?: {...}, error?: string }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyCredentials, createSession, checkRateLimit, resetRateLimit } from '@/lib/auth';

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email, password } = req.body as LoginRequest;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Rate limiting (5 attempts per 15 minutes)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `login:${clientIp}`;

    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many login attempts. Please try again in 15 minutes.',
      });
    }

    // Verify credentials
    const user = await verifyCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Create session
    await createSession(user.id, user.email, user.companyId);

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // Return success
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
