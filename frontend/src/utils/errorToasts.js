import { toast } from "react-toastify";

export function showErrorToast(message, scannerActive) {
  if (scannerActive) return;
  toast.error(message);
}

export function handleBackendError(error, scannerActive) {
  if (scannerActive) return;

  const msg = error.toLowerCase();

  if (msg.includes("no empty slot")) {
    toast.error("Library is full. Please wait.");
  } else if (msg.includes("network")) {
    toast.error("System offline. Check internet.");
  } else {
    toast.error("System error.");
  }
}
