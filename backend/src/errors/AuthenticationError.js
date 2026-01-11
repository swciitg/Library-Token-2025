import { CustomError } from "./custom.error.js";

// Thrown when user authentication fails (e.g. bad credentials, invalid JWT)
export class AuthenticationError extends CustomError {
  constructor(message = "Authentication failed") {
    super(message, 401, "Authentication Error");
  }
}

