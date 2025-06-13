import { createContext, useContext, useState, type ReactNode } from "react";

export type SnackbarType = "success" | "error" | "info";

interface SnackbarContextType {
  message: string;
  type: SnackbarType;
  isVisible: boolean;
  showSnackbar: (msg: string, type?: SnackbarType) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("success");
  const [isVisible, setIsVisible] = useState(false);

  const showSnackbar = (msg: string, type: SnackbarType = "success") => {
    setMessage(msg);
    setType(type);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  };

  const hideSnackbar = () => setIsVisible(false);

  return (
    <SnackbarContext.Provider value={{ message, type, isVisible, showSnackbar, hideSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useSnackbar must be used within SnackbarProvider");
  return context;
};
