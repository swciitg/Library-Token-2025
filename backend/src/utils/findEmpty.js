import prisma from "../db/config.js";

const shelfRanges = [
  { start: 1, end: 84, shelfId: 1 },
  { start: 85, end: 140, shelfId: 2 },
  { start: 141, end: 224, shelfId: 3 },
  { start: 225, end: 314, shelfId: 4 },
  { start: 315, end: 404, shelfId: 5 },
  { start: 405, end: 494, shelfId: 6 },
  { start: 495, end: 584, shelfId: 7 },
];

const priority = [2, 4, 3, 5, 1, 7, 6];

export function getShelfBySlotId(slotId) {
  return shelfRanges.find(r => slotId >= r.start && slotId <= r.end);
}

export async function findFirstEmptySlot() {
  try {
    const allShelves = await prisma.shelfStatus.findMany({
      where: { nextEmpty: { not: null } },
      select: { shelfId: true, nextEmpty: true },
    });

    for (const shelfId of priority) {
      const shelf = allShelves.find(s => s.shelfId === shelfId);
      if (shelf && shelf.nextEmpty != null) {
        return shelf.nextEmpty;
      }
    }

    return null;
  } catch (err) {
    console.error("findFirstEmptySlot error:", err);
    throw err;
  }
}

export async function updateShelfStatus(slotId, shelf) {
  try {
    await prisma.shelfStatus.update({
      where: { shelfId: shelf.shelfId },
      data: { nextEmpty: slotId },
    });
  } catch (err) {
    console.error("updateShelfStatus error:", err);
    throw err;
  }
}


export async function allocateSlotAndUpdateShelf(rollNo, slotId) {
  const shelf = getShelfBySlotId(slotId);
  if (!shelf) throw new Error(`Slot ${slotId} not in any shelf range`);

  try {
    const [newEntry] = await prisma.$transaction([
      prisma.entry.create({
        data: { roll_no: rollNo, slotId },
      }),
      prisma.slot.update({
        where: { id: slotId },
        data: { isEmpty: false },
      }),
    ]);

    let nextEmpty = null;
    if (slotId < shelf.end) {
      const nextEmptySlot = await prisma.slot.findFirst({
        where: {
          id: { gt: slotId, lte: shelf.end },
          isEmpty: true,
        },
        orderBy: { id: "asc" },
        select: { id: true },
      });
      nextEmpty = nextEmptySlot?.id ?? null;
    }

    await prisma.shelfStatus.update({
      where: { shelfId: shelf.shelfId },
      data: { nextEmpty },
    });

    return {
      message: "Slot allocated and shelf updated",
      shelfId: shelf.shelfId,
      nextEmpty,
      entry: newEntry,
    };
  } catch (err) {
    console.error("Error allocating slot:", err);
    throw err;
  }
}


export async function deallocateSlotAndUpdateShelf(slotId) {
  const shelf = getShelfBySlotId(slotId);
  if (!shelf) throw new Error(`Slot ${slotId} not in any shelf range`);

  try {
    await prisma.slot.update({
      where: { id: slotId },
      data: { isEmpty: true },
    });

    await prisma.entry.deleteMany({
      where: { slotId },
    });

    await updateShelfStatus(slotId, shelf);

    return {
      message: "Slot deallocated and shelf updated",
      shelfId: shelf.shelfId,
      nextEmpty: slotId,
    };
  } catch (err) {
    console.error("Error deallocating slot:", err);
    throw err;
  }
}

export default findFirstEmptySlot;