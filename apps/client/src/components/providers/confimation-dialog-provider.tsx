import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmationDialogProviderProps {
  children: ReactNode;
}
export interface IConfirmationDialogContext {
  setDialogState: Dispatch<
    SetStateAction<{ isOpen: boolean; confirmFunction(): void }>
  >;
}

export const ConfirmationDialogContext =
  createContext<IConfirmationDialogContext>({
    setDialogState: () => {},
  });
const ConfirmationDialogProvider: FC<ConfirmationDialogProviderProps> = ({
  children,
}) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    confirmFunction(): void;
  }>({
    isOpen: false,
    confirmFunction() {},
  });

  return (
    <ConfirmationDialogContext.Provider
      value={{
        setDialogState,
      }}
    >
      <AlertDialog
        onOpenChange={(value) => {
          if (!value) {
            setDialogState({
              confirmFunction() {},
              isOpen: value,
            });
          }
        }}
        open={dialogState.isOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siz tam əminsinizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu əməliyyat geri qaytarıla bilməz. Bu, serverlərimizdən
              məlumatları həmişəlik siləcək.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
            <AlertDialogAction onClick={() => dialogState.confirmFunction()}>
              Davam et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

export default ConfirmationDialogProvider;
