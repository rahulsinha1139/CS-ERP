/**
 * Invoice Groups Page
 * Manage quarterly consolidated invoicing and invoice packages
 */

import React from 'react';
import Head from 'next/head';
import { AuraLayout } from '@/components/ui/aura-layout';
import { InvoiceGroupManager } from '@/components/invoices/invoice-group-manager';

export default function InvoiceGroupsPage() {
  return (
    <AuraLayout>
      <Head>
        <title>Invoice Groups | CS ERP</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <InvoiceGroupManager />
      </div>
    </AuraLayout>
  );
}
