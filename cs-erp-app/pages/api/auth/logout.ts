/**
 * Logout API Endpoint
 * POST /api/auth/logout
 *
 * Destroys the current session
 * Returns: { success: boolean }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { destroySession } from '@/lib/auth';

type LogoutResponse = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Destroy session
    await destroySession();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
