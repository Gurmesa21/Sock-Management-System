const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function search() {
  const tables = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
  for(const t of tables) {
    if(prisma[t].findFirst) {
      const res = await prisma[t].findFirst({where: {id: 'bce8ed21-2053-4c7d-946d-906f7b3f6f81'}}).catch(()=>null);
      if(res) console.log('Found in ' + t, res);
    }
  }
}
search().then(() => process.exit(0));
