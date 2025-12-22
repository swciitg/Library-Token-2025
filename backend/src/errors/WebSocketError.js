import { CustomError } from "./custom.error.js";

// Thrown when there are issues sending real-time slot updates via WebSocket
export class WebSocketError extends CustomError {
  constructor(message = "WebSocket operation failed") {
    super(message, 500, "WebSocket Error");
  }
}

