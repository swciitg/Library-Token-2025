import prisma from "../db/config.js";
import findFirstEmptySlot from "../utils/findEmpty.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ValidationError } from "../errors/ValidationError.js";

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
      await prisma.student.delete({ where: {roll_no: rollNo}});
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
          }),
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

export const checkStudentStatus = async (req, res) => {
  try {
    const rollNo = parseInt(req.query.rollNo, 10);
    const entry = await prisma.entry.findUnique({
      where: {
        roll_no: rollNo,
      },
    });

    // If no slot exists
    if (!entry) {
      return res.status(200).json({
        message: null,
        isBanned: false,
        slotId: null,
      });
    }

    const now = new Date();
    const createdAt = entry.createdAt;

    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // 0 - 24 hrs
    if (diffHours <= 1/30) {
      return res.status(200).json({
        message: null,
        isBanned: false,
        slotId: entry.slotId,
      });
    }

    // 24 - 48 hrs
    if (diffHours > 1/30 && diffHours <= 1/15) {
      const remaining = Math.ceil(48 - diffHours);
      return res.status(200).json({
        message: `Collect your bag in ${remaining} hrs`,
        isBanned: false,
        slotId: entry.slotId,
      });
    }

    // > 48 hrs
    if (diffHours >= 1/15){

      let student = await prisma.student.findUnique({
        where: {roll_no: rollNo},
      });

      if (!student) {
        await prisma.student.create({
          data: {
            roll_no: rollNo,
            isBanned: true,
          },
        });
      } else if (!student.isBanned) {
        await prisma.student.update({
          where: { roll_no: rollNo },
          data: { isBanned: true },
        });
      }

      return res.status(200).json({
        message: `You are banned collect your bag from slot id ${entry.slotId} to keep using onestop`,
        isBanned: true,
        slotId: entry.slotId,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};