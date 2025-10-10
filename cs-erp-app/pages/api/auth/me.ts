/**
 * Get Current User API Endpoint
 * GET /api/auth/me
 *
 * Returns current session user data
 * Returns: { authenticated: boolean, user?: {...} }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth';

type MeResponse = {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    companyId: string;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse>
) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      authenticated: false,
      error: 'Method not allowed',
    });
  }

  try {
    const session = await getSession();

    if (!session) {
      return res.status(200).json({
        authenticated: false,
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        companyId: session.companyId,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      authenticated: false,
      error: 'Internal server error',
    });
  }
}
