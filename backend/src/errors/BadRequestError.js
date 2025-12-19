import { CustomError } from "./custom.error.js";

// Thrown when request is malformed or contains invalid data
export class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400, "Bad Request Error");
  }
}

