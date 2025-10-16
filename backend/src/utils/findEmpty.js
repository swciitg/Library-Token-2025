import prisma from "../db/config.js";

async function findFirstEmptySlot() {
  const slot=await prisma.slot.findFirst({
    where: { is_empty:true },
    orderBy: { slot_id:"asc" },
  });
  return slot;
}

export default findFirstEmptySlot;