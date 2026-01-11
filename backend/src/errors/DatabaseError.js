import { CustomError } from "./custom.error.js";

// Thrown when Prisma / database operations fail in an unexpected way
export class DatabaseError extends CustomError {
  constructor(message = "Database operation failed") {
    super(message, 500, "Database Error");
  }
}

