import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient";

const registerUser = async (userData) => {
  const { email, password } = userData;
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
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    name: user.name,
    email: user.email,
  };
};

module.exports = { registerUser, loginUser };