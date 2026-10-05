const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get an item and a location to tie batches to
  const item = await prisma.item.findFirst();
  const location = await prisma.location.findFirst();

  if (!item || !location) {
    console.log("No items or locations found. Please ensure database has basic master data.");
    return;
  }

  const now = new Date();

  // Create 1. Expired
  const expiredDate = new Date();
  expiredDate.setDate(now.getDate() - 10);
  
  // Create 2. Expiring Soon
  const soonDate = new Date();
  soonDate.setDate(now.getDate() + 15);
  
  // Create 3. Safe
  const safeDate = new Date();
  safeDate.setDate(now.getDate() + 100);

  // Seed batches
  await prisma.stockBatch.createMany({
    data: [
      {
        itemId: item.id,
        locationId: location.id,
        batchNumber: "TEST-EXP",
        quantity: 10,
        expiryDate: expiredDate,
        status: "ACTIVE",
      },
      {
        itemId: item.id,
        locationId: location.id,
        batchNumber: "TEST-SOON",
        quantity: 20,
        expiryDate: soonDate,
        status: "ACTIVE",
      },
      {
        itemId: item.id,
        locationId: location.id,
        batchNumber: "TEST-SAFE",
        quantity: 50,
        expiryDate: safeDate,
        status: "ACTIVE",
      },
      {
        itemId: item.id,
        locationId: location.id,
        batchNumber: "TEST-NO-EXP",
        quantity: 30,
        expiryDate: null,
        status: "ACTIVE",
      }
    ]
  });

  console.log("Seed complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
