import { useContext } from "react";
import { ConfirmationDialogContext } from "@/components/providers/confimation-dialog-provider";

export default function useConfirmationDialog() {
  return useContext(ConfirmationDialogContext);
}
