import jwt from "jsonwebtoken";
import { AuthenticationError } from "../errors/AuthenticationError.js";

// Use custom AuthenticationError, but keep the same token variable/logic
export const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      // No token provided
      throw new AuthenticationError("Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // Token invalid or expired
        return next(new AuthenticationError("Invalid token"));
      }

      req.user = user;
       next();
    });
  } catch (error) {
    return next(error);
  }
};
