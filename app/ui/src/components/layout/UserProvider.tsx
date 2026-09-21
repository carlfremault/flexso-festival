import { createContext, useContext, useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { apiFetch } from "@/utils/apiFetch";

interface UserContextValue {
  isAdmin: boolean;
  id: string;
  givenName: string;
  familyName: string;
}

interface WhoAmIResponse {
  isAdmin: boolean;
  id: string;
  givenName?: string;
  familyName?: string;
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const fetchWhoAmI = async (): Promise<WhoAmIResponse> =>
  apiFetch({ service: "user", path: "/whoami()" });

const useWhoAmI = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["user", "whoami"],
    queryFn: fetchWhoAmI,
  });
  return data;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useWhoAmI();

  const value = useMemo(() => {
    const isAdmin = data.isAdmin;
    const id = data.id;
    const givenName = data.givenName ?? "";
    const familyName = data.familyName ?? "";

    return { isAdmin, id, givenName, familyName };
  }, [data]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
