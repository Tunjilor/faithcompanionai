"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserData {
  premium: boolean;
  isPremium: boolean;
  authed: boolean;
  signedIn: boolean;
  userId: string | null;
  email: string | null;
  premiumUntil: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  actorKey: string | null;
  guestName: string | null;
  displayName: string | null;
  hasPassword?: boolean;
  referralCount?: number;
  guest: { id: string; createdAt: string; trial: any } | null;
}

const defaultUser: UserData = {
  premium: false, isPremium: false, authed: false, signedIn: false,
  userId: null, email: null, premiumUntil: null, customerId: null,
  subscriptionId: null, actorKey: null, guestName: null, displayName: null,
  referralCount: 0, guest: null,
};

const UserContext = createContext<UserData>(defaultUser);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);
  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser(defaultUser));
  }, []);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): UserData {
  return useContext(UserContext);
}
