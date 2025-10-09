import { db } from '../src/server/db';
import { idGenerator } from '../src/lib/id-generator';
import { CS_SERVICE_TEMPLATES } from '../src/lib/service-template-definitions';

const companyId = 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b';

async function main() {
  const existing = await db.serviceTemplate.count({ where: { companyId } });

  if (existing > 0) {
    console.log('✅ Templates already initialized:', existing);
    return;
  }

  for (const t of CS_SERVICE_TEMPLATES) {
    await db.serviceTemplate.create({
      data: {
        id: idGenerator.generate(),
        name: t.name,
        description: t.description || null,
        defaultRate: t.defaultRate,
        gstRate: t.gstRate,
        hsnSac: t.hsnSac || null,
        category: t.category || null,
        customFields: t.customFields as any,
        companyId,
      },
    });
  }

  console.log('✅ Created', CS_SERVICE_TEMPLATES.length, 'templates');
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
