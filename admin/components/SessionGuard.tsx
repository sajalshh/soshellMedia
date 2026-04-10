"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    function handleExpired() {
      router.push("/login");
      router.refresh();
    }

    window.addEventListener("session-expired", handleExpired);
    return () => window.removeEventListener("session-expired", handleExpired);
  }, [router]);

  return null;
}
