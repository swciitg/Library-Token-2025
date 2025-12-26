import prisma from "../db/config.js";
import { DatabaseError } from "../errors/DatabaseError.js";

const TOTAL_SLOTS = 584;

const v_local = new Array(TOTAL_SLOTS).fill(0);
const val = new Array(TOTAL_SLOTS).fill(0);

for (let i = 405; i <= 494; i++) {
  val[i - 1] = Math.floor((i - 403) / 4);
  val[i - 1] *= 10;
}
for (let i = 315; i <= 403; i++) {
  val[i - 1] = Math.floor((406 - i) / 4);
  val[i - 1] *= 10;
}
for (let i = 495; i <= 584; i++) {
  val[i - 1] = Math.floor((586 - i) / 4);
  val[i - 1] += 2;
  val[i - 1] *= 10;
}
for (let i = 225; i <= 314; i++) {
  val[i - 1] = Math.floor((i - 223) / 4);
  val[i - 1] += 2;
  val[i - 1] *= 10;
}

let k_val = Math.floor((314 - 223) / 4);

for (let i = 94; i >= 85; i--) {
  val[i - 1] = k_val * 10 + 95 - i;
  val[i + 19] = k_val * 10 + 115 - i;
  val[i + 39] = k_val * 10 + 135 - i;
}
for (let i = 95; i <= 104; i++) {
  val[i - 1] = k_val * 10 + i - 94;
  val[i + 19] = k_val * 10 + i - 114;
  if (i <= 140) val[i + 39] = k_val * 10 + i - 134;
}
for (let i = 1; i <= 84; i++) {
  val[i - 1] = Math.floor((i - 1) / 4);
  val[i - 1] += 8;
  val[i - 1] *= 10;
}
for (let i = 224; i >= 141; i--) {
  val[i - 1] = Math.floor((224 - i) / 4);
  val[i - 1] += 8;
  val[i - 1] *= 10;
}

for (let i = 0; i < TOTAL_SLOTS; i++) {
  if (typeof val[i] === "undefined") val[i] = 100000;
}

const priorityOrder = Array.from({ length: TOTAL_SLOTS }, (_, idx) => ({
  id: idx + 1,
  priority: val[idx],
}))
  .sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id - b.id;
  })
  .map((x) => x.id);

async function findFirstEmptySlot() {
  try {
    for (const candidateId of priorityOrder) {
      const res = await prisma.slot.updateMany({
        where: {
          id: candidateId,
          isEmpty: true,
        },
        data: {
          isEmpty: false,
        },
      });

      if (res.count && res.count === 1) {
        const slot = await prisma.slot.findUnique({
          where: { id: candidateId },
        });
        v_local[candidateId - 1] = 1;
        return slot;
      }
    }

    return null;
  } catch (err) {
    throw new DatabaseError(
      "Failed to find or allocate empty slot: " + (err?.message ?? err)
    );
  }
}

export default findFirstEmptySlot;
