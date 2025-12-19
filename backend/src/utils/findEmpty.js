import prisma from "../db/config.js";
import { DatabaseError } from "../errors/DatabaseError.js";

async function findFirstEmptySlot() {
  try {
    const slot = await prisma.slot.findFirst({
      where: { isEmpty: true },
      orderBy: { id: "asc" },
    });
    return slot;
  } catch (error) {
    throw new DatabaseError("Failed to find empty slot");
  }
}

export default findFirstEmptySlot;