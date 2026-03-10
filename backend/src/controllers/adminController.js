import prisma from "../db/config.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";

export const blockSlot = async (req, res, next) => {
  try {
    const { slotId } = req.body;

    if (!slotId || isNaN(slotId)) {
      throw new ValidationError("Valid slot ID is required");
    }

    const slot = await prisma.slot.findUnique({
      where: { id: parseInt(slotId) },
    });

    if (!slot) {
      throw new NotFoundError("Slot not found");
    }

    if (slot.isBlocked) {
      throw new ValidationError("Slot is already blocked");
    }

    const updatedSlot = await prisma.slot.update({
      where: { id: parseInt(slotId) },
      data: { isBlocked: true },
    });

    res.status(200).json({
      success: true,
      message: "Slot blocked successfully",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error("Error in blockSlot:", error);

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return next(error);
    }

    return next(new DatabaseError("Failed to block slot"));
  }
};

export const unblockSlot = async (req, res, next) => {
  try {
    const { slotId } = req.body;

    if (!slotId || isNaN(slotId)) {
      throw new ValidationError("Valid slot ID is required");
    }

    const slot = await prisma.slot.findUnique({
      where: { id: parseInt(slotId) },
    });

    if (!slot) {
      throw new NotFoundError("Slot not found");
    }

    if (!slot.isBlocked) {
      throw new ValidationError("Slot is not blocked");
    }

    const updatedSlot = await prisma.slot.update({
      where: { id: parseInt(slotId) },
      data: { isBlocked: false },
    });

    res.status(200).json({
      success: true,
      message: "Slot unblocked successfully",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error("Error in unblockSlot:", error);

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return next(error);
    }

    return next(new DatabaseError("Failed to unblock slot"));
  }
};
