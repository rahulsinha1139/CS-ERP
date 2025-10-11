/**
 * Database Connection Diagnostic
 * Check if DATABASE_URL is configured and Prisma can connect
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if DATABASE_URL exists
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      return res.status(500).json({
        success: false,
        error: 'DATABASE_URL not found in environment variables',
        env: {
          hasDatabaseUrl: false,
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSessionPassword: !!process.env.SESSION_PASSWORD,
        }
      });
    }

    // Try to connect to database
    await db.$connect();

    // Try a simple query
    const companyCount = await db.company.count();
    const customerCount = await db.customer.count();
    const invoiceCount = await db.invoice.count();

    await db.$disconnect();

    return res.status(200).json({
      success: true,
      message: 'Database connection successful!',
      data: {
        companies: companyCount,
        customers: customerCount,
        invoices: invoiceCount,
      },
      env: {
        hasDatabaseUrl: true,
        databaseHost: dbUrl.split('@')[1]?.split(':')[0] || 'unknown',
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSessionPassword: !!process.env.SESSION_PASSWORD,
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSessionPassword: !!process.env.SESSION_PASSWORD,
      }
    });
  }
}
