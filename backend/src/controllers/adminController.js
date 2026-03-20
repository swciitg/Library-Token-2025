import prisma from "../db/config.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ValidationError } from "../errors/ValidationError.js";
import crypto from "crypto";

function decryptWithAesGcm(encrypted) {
  const [ivB64, tagB64, dataB64] = encrypted.split(".");

  const key = crypto
    .createHash("sha256")
    .update(process.env.HASH_SECRET, "utf8")
    .digest();

  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

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

export const getInfo = async (req, res, next) => {
  try {
    const slot = req.query.slot;

    if (!slot || isNaN(slot)) {
      throw new ValidationError("Valid slot is required");
    }

    const entry = await prisma.entry.findUnique({
      where: { slotId: parseInt(slot) },
    });

    if (!entry) {
      throw new NotFoundError("No entry found for this slot");
    }

    const rollNo = entry.roll_no;

    const prefix = String(rollNo).slice(0, 2);
    const year = `20${prefix}`;
    const imageUrl = `https://online.iitg.ac.in/sprofile/GALLERY/${year}/PHOTO/${rollNo}_P.jpg`;

    function hmacRollNo(rollNo) {
      return crypto
        .createHmac("sha256", process.env.HASH_SECRET)
        .update(String(rollNo), "utf8")
        .digest("hex");
    }

    const token = hmacRollNo(rollNo);

    const url = `https://swc.iitg.ac.in/onestop/api/v3/gatelog/secure?rollNo=${rollNo}&token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `External API request failed with status ${response.status}`,
      );
    }

    const apiResponse = await response.json();
    const encryptedPayload = apiResponse.data;
    const decryptedString = decryptWithAesGcm(encryptedPayload);
    const decryptedData = JSON.parse(decryptedString);

    res.status(200).json({
      success: true,
      name: decryptedData.name,
      email: decryptedData.outlookEmail,
      rollNo: decryptedData.rollNo,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return next(error);
    }

    return next(new DatabaseError("Failed to retrieve information"));
  }
};
