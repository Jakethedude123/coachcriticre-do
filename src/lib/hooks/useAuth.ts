"use client";

import { useContext } from "react";
import { AuthContext } from "@/lib/contexts/AuthContext";
import type { AuthContextType } from "@/lib/contexts/AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};