"use client";
import { useUser } from "@/context/UserContext";

export function usePremium() {
  const user = useUser();
  return {
    isPremium: user.isPremium,
    premium: user.premium,
    premiumUntil: user.premiumUntil,
    loading: false,
  };
}
