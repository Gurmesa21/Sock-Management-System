const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const service = require('./src/services/issue-voucher.service');

async function main() {
  const storeIssue = await prisma.storeIssue.findFirst({
    where: { status: 'ISSUED' },
    include: { requisition: true }
  });

  if (!storeIssue) {
    console.log("No ISSUED StoreIssue found in the database. Please create one manually or via UI to test duplicate prevention.");
    return;
  }
  
  console.log(`Using StoreIssue: ${storeIssue.id} [Status: ${storeIssue.status}]`);
  
  // Clean up any existing vouchers for this issue
  await prisma.issueVoucher.deleteMany({ where: { storeIssueId: storeIssue.id }});
  
  const user = await prisma.user.findFirst();

  try {
    const v1 = await service.createVoucher(user.id, {
      storeIssueId: storeIssue.id,
      type: "SIV"
    });
    console.log(`Success: Created voucher 1 - ${v1.voucherNo}`);
    
    // Attempt duplicate
    try {
      const v2 = await service.createVoucher(user.id, {
        storeIssueId: storeIssue.id,
        type: "SIV"
      });
      console.log(`FAIL: Expected error but created duplicate ${v2.voucherNo}`);
    } catch (err) {
      if (err.statusCode === 400 && err.message.includes("already exists")) {
        console.log(`Success: Duplicate cleanly rejected - ${err.message}`);
      } else {
        console.log(`FAIL: Unexpected error on duplicate attempt -`, err);
      }
    }
  } catch (err) {
    console.log("Error creating first voucher:", err);
  }

  // Clean up
  console.log("Cleaning up test data...");
  await prisma.issueVoucher.deleteMany({ where: { storeIssueId: storeIssue.id }});
  console.log("Cleanup complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
