const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const issueInclude = {
  requisition: true,
  store: true,
  issuedBy: {
    select: {
      id: true,
      username: true,
      fullName: true,
    },
  },
  items: {
    include: {
      item: true,
      location: true,
      requisitionItem: true,
    },
  },
  vouchers: true,
};

async function test() {
  try {
    const issues = await prisma.storeIssue.findMany({
      take: 1,
      include: issueInclude
    });
    console.log("Success:", issues);
  } catch (err) {
    console.error("Prisma Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
