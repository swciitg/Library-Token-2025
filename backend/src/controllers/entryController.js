import prisma from "../db/config.js";
import findFirstEmptySlot from "../utils/findEmpty.js";

export const addDeleteEntry = async (req, res) => {
  const data = req.body;
  console.log(data);

  const rollNo = parseInt(data.rollNo, 10);
  console.log(rollNo);

  try {
    const existing = await prisma.entry.findUnique({
      where: { roll_no: rollNo },
    });
    if (existing) {
      // retrive
      await prisma.entry.delete({ where: { roll_no: rollNo } });
      await prisma.slot.update({
        where: { id: existing.slotId },
        data: { isEmpty: true },
      });
      return res
        .status(200)
        .json({
          message: "checkout successful",
          checkout_slot: existing.slotId,
          status: "checkout",
        });
    } else {
      //entry
      const emptySlot = await findFirstEmptySlot();
      if (!emptySlot) {
        return res.status(400).json({ message: "no empty slot is available" });
      }
      const newEntry = await prisma.entry.create({
        data: { roll_no: rollNo, slotId: emptySlot.id },
      });
      await prisma.slot.update({
        where: { id: emptySlot.id },
        data: { isEmpty: false },
      });
      // return res.send(entry);
      console.log(newEntry);
      console.log(emptySlot.id);
      return res
        .status(200)
        .json({
          message: "Check-in successful",
          checkin_slot: emptySlot.id,
          status: "checkin",
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
