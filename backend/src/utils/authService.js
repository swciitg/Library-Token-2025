import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db/config.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { ValidationError } from "../errors/ValidationError.js";

const registerUser = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (err) {
    throw new DatabaseError("Failed to register user");
  }
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      token,
      name: user.name,
      email: user.email,
    };
  } catch (err) {
    if (err instanceof AuthenticationError || err instanceof ValidationError) {
      throw err;
    }
    throw new DatabaseError("Failed to login user");
  }
};

export { registerUser, loginUser };