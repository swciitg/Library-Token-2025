import { CustomError } from "./custom.error.js";

// Thrown when Redis operations fail (connection, get, set, etc.)
export class RedisError extends CustomError {
  constructor(message = "Redis operation failed") {
    super(message, 500, "Redis Error");
  }
}

