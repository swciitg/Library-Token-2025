import { toast } from "react-toastify";

export const SCANNER_TOAST_ID = "scanner-not-ready";

export function showScannerNotReady() {
  if (toast.isActive(SCANNER_TOAST_ID)) return;

  toast.error(
    "Scanner not ready. Click on the screen and rescan.",
    {
      toastId: SCANNER_TOAST_ID,
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    }
  );
}

export function clearScannerNotReady() {
  toast.dismiss(SCANNER_TOAST_ID);
}
