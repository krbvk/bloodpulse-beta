"use client";

import { useState, useEffect } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  if (!mounted) {
    return <CustomLoader />; 
  }

  return <>{children}</>; 
}