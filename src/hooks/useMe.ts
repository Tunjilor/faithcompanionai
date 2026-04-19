"use client";
import { useUser } from "@/context/UserContext";

export function useMe() {
  const user = useUser();
  return {
    me: user,
    loading: false,
  };
}
