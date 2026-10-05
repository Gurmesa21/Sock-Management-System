const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addColumn() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "purchase_requisitions" ADD COLUMN IF NOT EXISTS "estimatedCost" DECIMAL(16,2)`
  );
  console.log('Column estimatedCost added successfully.');
}

addColumn()
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.$disconnect().catch(() => {}));
