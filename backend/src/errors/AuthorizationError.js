import { CustomError } from "./custom.error.js";

// Thrown when a user is authenticated but not allowed to perform an action
export class AuthorizationError extends CustomError {
  constructor(message = "You are not allowed to perform this action") {
    super(message, 403, "Authorization Error");
  }
}

