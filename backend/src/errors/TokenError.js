import { CustomError } from "./custom.error.js";

// Thrown for issues related to short-lived library tokens (missing, expired, invalid)
export class TokenError extends CustomError {
  constructor(message = "Token is invalid or has expired") {
    super(message, 401, "Token Error");
  }
}

