import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/config.js";
import { ValidationError } from "../errors/ValidationError.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";
import { DatabaseError } from "../errors/DatabaseError.js";

const generateJWT = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email, password, and are required");
    }

    if (password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AuthenticationError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateJWT(user.id, user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);

    if (
      error instanceof ValidationError ||
      error instanceof AuthenticationError
    ) {
      return next(error);
    }

    return next(new DatabaseError("Failed to register user"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const token = generateJWT(user.id, user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
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
