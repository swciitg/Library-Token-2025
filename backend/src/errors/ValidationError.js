import { CustomError } from "./custom.error.js";

// Thrown when incoming request data is missing or invalid
export class ValidationError extends CustomError {
  constructor(message = "Request validation failed") {
    super(message, 400, "Validation Error");
  }
}

