"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SiteGate from "@/app/components/SiteGate";

export default function LockPage() {
  const router = useRouter();

  useEffect(() => {
    // If already unlocked, redirect to home
    if (Cookies.get("cc_gate_open") === "true") {
      router.replace("/");
    }
  }, [router]);

  return <SiteGate><></SiteGate>;
} 