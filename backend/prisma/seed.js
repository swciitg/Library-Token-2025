import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const ops = [];
  for (let i = 1; i <= 1000; i++) {
    ops.push(
      prisma.slot.upsert({
        where: { id: i },
        update: {},
        create: { id: i, isEmpty: true },
      })
    );
  }
  await prisma.$transaction(ops);
  console.log('Seeded slots 1..1000');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
