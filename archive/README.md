# Archive Directory

This directory contains legacy and backup files that are no longer actively used in production but are preserved for reference and rollback capability.

## Directory Structure

- `legacy/routers/` - Legacy API router files
- `legacy/lib/` - Legacy library and utility files
- `legacy/pages/` - Legacy page component files
- `legacy/styles/` - Legacy CSS and styling files

## Files Archived on September 27, 2025

### Legacy Routers (Not Used in Production)
- `dashboard.ts` - Original dashboard router (replaced by dashboard-optimized.ts)
- `customer-mock.ts` - Mock customer router for testing
- `communication-enhanced.ts` - Enhanced communication router (development version)
- `payment-enhanced.ts` - Enhanced payment router (development version)

### Backup Files
- `company.ts.backup` - Backup of company router
- `service.ts.backup` - Backup of service router
- `pdf-engine.ts.backup` - Backup of PDF engine
- `trpc-client-mock.ts.backup` - Backup of mock tRPC client

### Legacy Utilities
- `mock-data.ts` - Mock data utilities for testing
- `temp_tailwind_backup.txt` - Temporary Tailwind configuration backup

## Current Production Files

The main production system uses:
- `dashboard-optimized.ts` (active dashboard router)
- `customer.ts` (active customer router)
- `communication.ts` (active communication router)
- `payment.ts` (active payment router)

## Restoration Instructions

If any archived file needs to be restored:
1. Copy file from archive to original location
2. Update imports in `src/server/api/root.ts` if necessary
3. Run tests to verify functionality
4. Update this README with changes

## Safety Note

All archived files are preserved with their original content. No data or functionality has been lost - files are simply moved to prevent compilation conflicts.