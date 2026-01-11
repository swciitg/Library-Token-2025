import { CustomError } from "./custom.error.js";

// Thrown when a resource conflict occurs (e.g., duplicate entry, slot already taken)
export class ConflictError extends CustomError {
  constructor(message = "Resource conflict") {
    super(message, 409, "Conflict Error");
  }
}

