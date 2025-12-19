import prisma from "../db/config.js";

const v = new Array(584).fill(0);
const val = new Array(584);

for (let i = 405; i <= 494; i++) {
  val[i - 1] = floor((i - 403) / 4);
  val[i - 1] *= 10;
}
for (let i = 315; i <= 403; i++) {
  val[i - 1] = floor((406 - i) / 4);
  val[i - 1] *= 10;
}
for (let i = 495; i <= 584; i++) {
  val[i - 1] = floor((586 - i) / 4);
  val[i - 1] += 2;
  val[i - 1] *= 10;
}
for (let i = 225; i <= 314; i++) {
  val[i - 1] = floor((i - 223) / 4);
  val[i - 1] += 2;
  val[i - 1] *= 10;
}

let k = floor((314 - 223) / 4);

for (let i = 94; i >= 85; i--) {
  val[i - 1] = k * 10 + 95 - i;
  val[i + 19] = k * 10 + 115 - i;
  val[i + 39] = k * 10 + 135 - i;
}
for (let i = 95; i <= 104; i++) {
  val[i - 1] = k * 10 + i - 94;
  val[i + 19] = k * 10 + i - 114;
  if (i <= 140) val[i + 39] = k * 10 + i - 134;
}
for (let i = 1; i <= 84; i++) {
  val[i - 1] = floor((i - 1) / 4);
  val[i - 1] += 8;
  val[i - 1] *= 10;
}
for (let i = 224; i >= 141; i--) {
  val[i - 1] = floor((224 - i) / 4);
  val[i - 1] += 8;
  val[i - 1] *= 10;
}

const getKey = () => {
  let k = -1;
  let mini = 10000;

  for (let i = 1; i <= 584; i++) {
    if (!v[i - 1]) {
      if (val[i - 1] < mini) {
        mini = val[i - 1];
        k = i;
      }
    }
  }
  v[k - 1] = 1;
  return k;
};

async function findFirstEmptySlot() {
  const slotId = getKey();
  const slot = await prisma.slot.findFirst({
    where: { id: slotId },
  });
  return slot;
}

export default findFirstEmptySlot;
