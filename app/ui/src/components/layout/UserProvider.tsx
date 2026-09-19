import { createContext, useContext, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

interface UserContextValue {
  isAdmin: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const fetchIsAdmin = async (): Promise<{ isAdmin: boolean }> =>
  apiFetch({ service: "user", path: "/whoami()" });

const useIsAdmin = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["user", "isAdmin"],
    queryFn: fetchIsAdmin,
  });
  return data;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useIsAdmin();

  const value = useMemo(() => ({ isAdmin: data?.isAdmin ?? false }), [data]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
