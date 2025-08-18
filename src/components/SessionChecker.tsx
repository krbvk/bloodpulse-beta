"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionChecker() {
  const { update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    // Only run session refresh if coming back from /auth/verify
    if (pathname !== "/auth/verify") return;

    const checkSession = async () => {
      if (checkedRef.current) return;
      checkedRef.current = true;

      const refreshedSession = await update();

      if (refreshedSession) {
        router.replace("/dashboard"); // logged in → go to dashboard
      } else {
        router.replace("/"); // fallback if somehow unauthenticated
      }

      // allow next check after 2 seconds
      setTimeout(() => {
        checkedRef.current = false;
      }, 2000);
    };

    void checkSession();
  }, [update, router, pathname]);

  return null;
}
