import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const totalSlots = 584; 
  const range = [
    { start: 1, end: 84, shelfId: 1 },
    { start: 85, end: 140, shelfId: 2 },
    { start: 141, end: 224, shelfId: 3 },
    { start: 225, end: 314, shelfId: 4 },
    { start: 315, end: 404, shelfId: 5 },
    { start: 405, end: 494, shelfId: 6 },
    { start: 495, end: 584, shelfId: 7 },
    
  ];
  const slots = [];

  for (let i = 1; i <= totalSlots; i++) {
    const shelf=range.find(r=>i>=r.start&&i<=r.end);
    const shelfId=shelf?shelf.shelfId:null;

    slots.push({
      id: i,
      isEmpty: true,
      shelfId,
    });
  }

  // Clear old data
  await prisma.slot.deleteMany();

  await prisma.slot.createMany({
    data: slots,
  });

  console.log(`Inserted ${totalSlots} slots`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
