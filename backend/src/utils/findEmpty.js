import prisma from "../db/config.js";

async function findFirstEmptySlot() {
  const slot=await prisma.slot.findFirst({
    where: { isEmpty:true },
    orderBy: { id:"asc" },
  });
  return slot;
}

export default findFirstEmptySlot;