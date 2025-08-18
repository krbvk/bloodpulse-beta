"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionChecker() {
  const { status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      await update();

      if (status === "authenticated") {
        router.push("/dashboard");
      }
    };

    // Wrap async calls with void to satisfy ESLint
    const handleFocus = () => void checkSession();
    const handleVisibilityChange = () => {
      if (!document.hidden) void checkSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // initial check on mount
    void checkSession();

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, update, router]);

  return null;
}
