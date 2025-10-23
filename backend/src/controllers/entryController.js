import prisma from "../db/config.js";
import findFirstEmptySlot, { allocateSlotAndUpdateShelf, deallocateSlotAndUpdateShelf } from "../utils/findEmpty.js";

export const allotSlot = async (req, res) => {
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
      // await prisma.entry.delete({ where: { roll_no: rollNo } });
      // await prisma.slot.update({
      //   where: { id: existing.slotId },
      //   data: { isEmpty: true },
      // });

      return res.status(200).json({
        message: "This roll number is already checked in",
        checkout_slot: existing.slotId,
        status: "slot-deallot",
      });

    } else {
      //entry
      const emptySlot = await findFirstEmptySlot();
      if (!emptySlot) {
        return res.status(400).json({ message: "no empty slot is available" });
      }
      console.log(emptySlot);
      return res.status(200).json({
        message: "Slot allotment successfull",
        checkin_slot: emptySlot,
        status: "slot-allot",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createEntry = async (req, res) => {
  const data = req.body;
  console.log(data);

  const rollNo = parseInt(data.rollNo, 10);
  console.log(rollNo);

  const slotId = parseInt(data.slotId, 10);
  console.log(slotId);

  const status = data.status;

  if (Number.isNaN(rollNo) || Number.isNaN(slotId)) {
    return res.status(400).json({ message: "Invalid rollNo or slotId" });
  }

  try {
    // 1) Check if roll is already checked-in
    // const existingRoll = await prisma.entry.findUnique({
    //   where: { roll_no: rollNo },
    // });
    if (status === "slot-deallot") {

      await deallocateSlotAndUpdateShelf(slotId);

      return res.status(200).json({
        message: "checkout successful",
        checkout_slot: slotId,
        status: "already-checked-in",
      });
    }

    // // 2) Check slot existence and emptiness
    // const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    // if (!slot) {
    //   return res.status(404).json({ message: "Slot not found" });
    // }
    // if (!slot.isEmpty) {
    //   return res
    //     .status(400)
    //     .json({ message: "Slot is not empty / already taken" });
    // }

    // 3) Create entry and mark slot not empty
    // const [newEntry, updatedSlot] = await prisma.$transaction([
    //   prisma.entry.create({
    //     data: { roll_no: rollNo, slotId: slotId },
    //   }),
    //   prisma.slot.update({
    //     where: { id: slotId },
    //     data: { isEmpty: false },
    //   }),
    // ]);

    const result = await allocateSlotAndUpdateShelf(rollNo, slotId);

    return res.status(201).json({
      message: "Database changed successfully",
      checkin_slot: slotId,
      status: "dbchange",
      entry: {
        id: result.entry.id.toString(),
        roll_no: result.entry.roll_no.toString(),
        slotId: result.entry.slotId.toString(),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

