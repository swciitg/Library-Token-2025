import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/config.js";
import { ValidationError } from "../errors/ValidationError.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";
import { DatabaseError } from "../errors/DatabaseError.js";

const generateJWT = (userId, username) => {
  return jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ValidationError("username and password are required");
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername) {
      throw new AuthenticationError("Invalid username or password");
    }

    if (password !== adminPassword) {
      throw new AuthenticationError("Invalid username or password");
    }

    const token = generateJWT("admin", username);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: "admin",
        username: username,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);

    if (
      error instanceof ValidationError ||
      error instanceof AuthenticationError
    ) {
      return next(error);
    }

    return next(new DatabaseError("Failed to login"));
  }
};
