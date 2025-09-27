/**
 * Test API endpoint to verify tRPC routing works
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../src/server/api/trpc';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection
    const companies = await db.company.count();

    res.status(200).json({
      message: 'tRPC API is working!',
      database: 'Connected',
      companiesCount: companies,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Test Error:', error);
    res.status(500).json({
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}