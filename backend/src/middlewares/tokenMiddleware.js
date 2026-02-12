import redisClient from "../utils/redisClient.js";
import { ValidationError } from "../errors/ValidationError.js";
import { TokenError } from "../errors/TokenError.js";
import { RedisError } from "../errors/RedisError.js";

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    console.log("Token verification middleware ", req.body);
    const { token } = req.body;

    if (!token) {
      throw new ValidationError("Token is required");
    }

    const roll_number = await redisClient.get(token);

    if (!roll_number) {
      throw new TokenError("Token is invalid or expired");
    }

    // Attach roll number to request object
    req.body.rollNo = parseInt(roll_number, 10);

    next(); // Continue to main controller
  } catch (err) {
    console.error("Token verification error:", err);
    if (err instanceof ValidationError || err instanceof TokenError) {
      return next(err);
    }
    return next(new RedisError("Internal token verification error"));
  }
};
