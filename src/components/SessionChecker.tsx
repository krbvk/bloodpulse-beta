"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionChecker() {
  const { status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // fetch session again from server
      await update();

      if (status === "authenticated") {
        router.push("/dashboard"); // redirect to dashboard if logged in
      }
    };

    // Check when PWA/tab gains focus
    const handleFocus = () => checkSession();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) checkSession();
    });

    // optional: check on mount
    checkSession();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [status, update, router]);

  return null; // nothing to render
}
