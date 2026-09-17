import { createContext, useContext, useState } from "react";
import { Toast } from "@ui5/webcomponents-react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast
        open={!!toastMessage}
        onClose={() => {
          setToastMessage(null);
        }}
      >
        {toastMessage}
      </Toast>
      {children}
    </ToastContext.Provider>
  );
};
