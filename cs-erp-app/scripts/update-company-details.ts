/**
 * Update Company Details Script
 * Run this once to update the Company record with proper contact details
 *
 * Usage: npx tsx scripts/update-company-details.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCompanyDetails() {
  try {
    console.log('🔄 Updating Pragnya Pradhan & Associates company details...');

    // Update the company record with UUID: c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b
    const updated = await prisma.company.update({
      where: {
        id: 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b',
      },
      data: {
        name: 'PRAGNYA PRADHAN & ASSOCIATES',
        email: 'pragnyap.pradhan@gmail.com',
        phone: '+91 9953457413',
        address: '46, LGF, JOR BAGH, New Delhi-110003',
        stateCode: '07',
        pan: 'AMEPP4323R',
        logo: '/images/company-logo.png',
        updatedAt: new Date(),
      },
    });

    console.log('✅ Company details updated successfully!');
    console.log('📋 Updated fields:');
    console.log(`   - Name: ${updated.name}`);
    console.log(`   - Email: ${updated.email}`);
    console.log(`   - Phone: ${updated.phone}`);
    console.log(`   - Address: ${updated.address}`);
    console.log(`   - PAN: ${updated.pan}`);
    console.log(`   - State Code: ${updated.stateCode}`);
    console.log(`   - Logo: ${updated.logo}`);
    console.log('\n✅ PDF footers will now display correctly!');

  } catch (error) {
    console.error('❌ Error updating company details:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateCompanyDetails()
  .then(() => {
    console.log('\n🎉 Update complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Update failed:', error);
    process.exit(1);
  });
