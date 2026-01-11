import { CustomError } from "./custom.error.js";

// Thrown when expected data is not found in the system (e.g. slot, entry, user)
export class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404, "Not Found Error");
  }
}

