import redisClient from "../utils/redisClient.js";
import { ValidationError } from "../errors/ValidationError.js";
import { RedisError } from "../errors/RedisError.js";


function generateToken(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export const storeToken = async (req, res, next) => {
  try {
    const { roll_number } = req.body;

    if (!roll_number) {
      // validation problem -> let global handler format it
      throw new ValidationError("Token and roll_number are required");
    }

    const token = generateToken(8);
    await redisClient.set(token, roll_number, { EX: 30 });

    res.status(200).json({
      success: true,
      message: "Token stored successfully",
      token,
      expiresIn: 30,
    });
  } catch (error) {
    console.error("Error storing token:", error);

    if (error instanceof ValidationError) {
      return next(error);
    }

    // Redis / unexpected issues
    return next(new RedisError("Failed to store token"));
  }
};

// Verify Token - no longer needed as middleware is used
// export const verifyToken = async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Token is required",
//       });
//     }

//     const roll_number = await redisClient.get(token);

//     if (!roll_number) {
//       return res.status(401).json({
//         success: false,
//         message: "Token is invalid or has expired",
//         roll_number: null,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Token verified successfully",
//       roll_number,
//     });
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to verify token",
//       error: error.message,
//     });
//   }
// };
