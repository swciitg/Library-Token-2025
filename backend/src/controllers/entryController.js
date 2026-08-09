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
      const student = await prisma.student.findUnique({
        where: { roll_no: rollNo },
      });
      if (student) {
        await prisma.student.delete({
          where: { roll_no: rollNo },
        });
      }
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
      const entryTime = new Date(newEntry.createdAt);
      const deadline = new Date(entryTime.getTime() + 48 * 60 * 60 * 1000);

      const leftTime = deadline.toISOString();
      const formattedDate = deadline.toISOString().split("T")[0];
      const formattedTime = deadline.toISOString().split("T")[1].split(".")[0];
      const displayDeadline =
        deadline
          .toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(" ", "T") + "+05:30";

      console.log(displayDeadline);
      console.log("entryController.js");
      console.log(`Collect your bag before ${displayDeadline}`);
      const slotData = {
        type: "slot_info",
        data: {
          message: `Collect your bag before ${displayDeadline}`,
          slotId: emptySlot.id,
          isEmpty: false,
          time: deadline.getTime(),
          date: formattedDate,
          timeString: formattedTime,
          deadline: leftTime,
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
    console.log("[checkStudentStatus] Request received for rollNo:", rollNo);

    const entry = await prisma.entry.findUnique({
      where: {
        roll_no: rollNo,
      },
    });

    if (!entry) {
      console.log("[checkStudentStatus] No entry found for rollNo:", rollNo);
      return res.status(200).json({
        message: null,
        isBanned: false,
        slotId: null,
      });
    }

    console.log(
      "[checkStudentStatus] Entry found for rollNo:",
      rollNo,
      "with slotId:",
      entry.slotId,
    );

    const now = new Date();
    const createdAt = entry.createdAt;

    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    console.log(
      "[checkStudentStatus] Time difference in hours:",
      diffHours,
      "[checkStudentStatus] Time difference in ms:",
      diffMs,
      "for rollNo:",
      rollNo,
    );

    // 0 - 24 hrs
    if (diffHours <= 1 / 30) {
      console.log(
        "[checkStudentStatus] Student is within first time window. rollNo:",
        rollNo,
      );
      return res.status(200).json({
        message: null,
        isBanned: false,
        slotId: entry.slotId,
      });
    }

    // 24 - 48 hrs
    if (diffHours > 1 / 30 && diffHours <= 1 / 15) {
      const remaining = Math.ceil(48 - diffHours);
      console.log(
        "[checkStudentStatus] Student is in reminder window. rollNo:",
        rollNo,
        "remaining hrs:",
        remaining,
      );
      return res.status(200).json({
        message: `Collect your bag in ${remaining} hrs`,
        isBanned: false,
        slotId: entry.slotId,
      });
    }

    // > 48 hrs
    if (diffHours >= 1 / 15) {
      console.log(
        "[checkStudentStatus] Student crossed 48-hour window. Banning rollNo:",
        rollNo,
      );
      let student = await prisma.student.findUnique({
        where: { roll_no: rollNo },
      });

      if (!student) {
        console.log(
          "[checkStudentStatus] Creating banned student record for rollNo:",
          rollNo,
        );
        await prisma.student.create({
          data: {
            roll_no: rollNo,
            isBanned: true,
          },
        });
      } else if (!student.isBanned) {
        console.log(
          "[checkStudentStatus] Updating existing student record to banned for rollNo:",
          rollNo,
        );
        await prisma.student.update({
          where: { roll_no: rollNo },
          data: { isBanned: true },
        });
      } else {
        console.log(
          "[checkStudentStatus] Student already marked as banned. rollNo:",
          rollNo,
        );
      }

      return res.status(200).json({
        message: `You are currently banned. Please collect your belongings from slot ID ${entry.slotId}. For further assistance or to continue using OneStop, kindly contact support.`,
        isBanned: true,
        slotId: entry.slotId,
      });
    }

    console.log(
      "[checkStudentStatus] No status condition matched for rollNo:",
      rollNo,
    );
  } catch (err) {
    console.error(
      "[checkStudentStatus] Error while checking student status:",
      err,
    );
    return res.status(500).json({ error: err.message });
  }
};
