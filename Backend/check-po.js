const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.purchaseOrder.findMany({ select: { id: true, status: true } }).then(console.log).finally(() => prisma.$disconnect());
