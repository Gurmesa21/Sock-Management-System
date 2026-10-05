const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.stockBatch.deleteMany({
    where: {
      batchNumber: {
        startsWith: "TEST-"
      }
    }
  });

  console.log("Cleanup complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
