import redisClient from "../utils/redisClient.js";

export const verifyTokenMiddleware = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const roll_number = await redisClient.get(token);

    if (!roll_number) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
        roll_number: null,
      });
    }

    // Attach roll number to request object
    req.body.rollNo = parseInt(roll_number, 10);

    next(); // Continue to main controller
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal token verification error",
    });
  }
};
