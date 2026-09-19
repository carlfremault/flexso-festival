import { createContext, useCallback, useContext, useMemo, useState } from "react";
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

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
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
