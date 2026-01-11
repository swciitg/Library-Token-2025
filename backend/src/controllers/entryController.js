import prisma from "../db/config.js";
import findFirstEmptySlot from "../utils/findEmpty.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { WebSocketError } from "../errors/WebSocketError.js";

export const addDeleteEntry = async (req, res, next) => {
  const data = req.body;
  console.log(data);

  const rollNo = parseInt(data.rollNo, 10);
  if (Number.isNaN(rollNo)) {
    return next(new ValidationError("Invalid rollNo"));
  }

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
      const ws = req.userConnections.get(rollNo.toString());
      if (ws && ws.readyState === 1) {
        ws.send(
          JSON.stringify({
            type: "slot_info",
            data: {
              message: "No slot assigned to this roll number",
            },
          })
        );
      }
      return res.status(200).json({
        message: "checkout successful",
        checkout_slot: existing.slotId,
        status: "checkout",
      });
    } else {
      //entry
      const emptySlot = await findFirstEmptySlot();
      if (!emptySlot) {
        throw new BadRequestError("No empty slot is available");
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
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().split(" ")[0];
      const slotData = {
        type: "slot_info",
        data: {
          slotId: emptySlot.id,
          isEmpty: false,
          time: Date.now(),
          date: formattedDate,
          timeString: formattedTime,
        },
      };

      const ws = req.userConnections.get(rollNo.toString());
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify(slotData));
      }
      return res.status(200).json({
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
      await prisma.$transaction([
        prisma.entry.delete({ where: { roll_no: rollNo } }),
        prisma.slot.update({
          where: { id: existing.slotId },
          data: { isEmpty: true },
        }),
      ]);

      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().split(" ")[0];
      const ws = req.userConnections.get(rollNo.toString());
      if (ws && ws.readyState === 1) {
        ws.send(
          JSON.stringify({
            type: "slot_info",
            data: {
              slotId: null,
              isEmpty: true,
              time: Date.now(),
              date: formattedDate,
              timeString: formattedTime,
            },
          })
        );
      }
      return res.status(200).json({
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
      console.log(emptySlot.id);
      return res.status(200).json({
        message: "Slot allotment successfull",
        checkin_slot: emptySlot.id,
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

  if (Number.isNaN(rollNo) || Number.isNaN(slotId)) {
    return res.status(400).json({ message: "Invalid rollNo or slotId" });
  }

  try {
    // 1) Check if roll is already checked-in
    const existingRoll = await prisma.entry.findUnique({
      where: { roll_no: rollNo },
    });
    if (existingRoll) {
      return res.status(400).json({
        message: "This roll number is already checked in",
        checkout_slot: existingRoll.slotId,
        status: "already-checked-in",
      });
    }

    // 2) Check slot existence and emptiness
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (!slot.isEmpty) {
      return res
        .status(400)
        .json({ message: "Slot is not empty / already taken" });
    }

    // 3) Create entry and mark slot not empty
    const [newEntry, updatedSlot] = await prisma.$transaction([
      prisma.entry.create({
        data: { roll_no: rollNo, slotId: slotId }, 
      }),
      prisma.slot.update({
        where: { id: slotId },
        data: { isEmpty: false },
      }),
    ]);

    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0];
    const ws = req.userConnections.get(rollNo.toString());
    if (ws && ws.readyState === 1) {
      ws.send(
        JSON.stringify({
          type: "slot_info",
          data: {
            slotId: newEntry.slotId,
            isEmpty: false,
            time: Date.now(),
            date: formattedDate,
            timeString: formattedTime,
          },
        })
      );
    }

    return res.status(201).json({
      message: "Database changed successfully",
      checkin_slot: slotId,
      status: "dbchange",
      entry: {
        id: newEntry.id.toString(),
        roll_no: newEntry.roll_no.toString(),
        slotId: newEntry.slotId.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

