"use client";

import HomePageCarousel from "@/components/Carousel/Homepage";
import Navbar from "@/components/Navbar/Homepage";
import { Box, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true);
    }
  }, [status]);

  useEffect(() => {
    if (isAuthenticated && isMounted) {
      router.push("/dashboard"); 
    }
  }, [isAuthenticated, isMounted, router]);

  if (status === "loading") {
    return (
      <Box style={{ position: "relative", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader size="xl" />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSplash = { id: Date.now(), x, y };

      setSplashes((prev) => [...prev, newSplash]);

      setTimeout(() => {
        setSplashes((prev) => prev.filter((splash) => splash.id !== newSplash.id));
      }, 1000);
    };

    return (
      <Box style={{ position: "relative", overflow: "hidden" }} onClick={handleClick}>
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {splashes.map((splash) => (
            <Box
              key={splash.id}
              style={{
                position: "absolute",
                left: splash.x,
                top: splash.y,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
                borderRadius: "50%",
                opacity: 0.7,
                transform: "translate(-50%, -50%)",
                animation: "splash 1s ease-out forwards",
                zIndex: 1001,
              }}
            />
          ))}
        </Box>

        <Navbar />
        <Box style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
          <HomePageCarousel />
        </Box>

        <style jsx>{`
          @keyframes splash {
            0% {
              transform: scale(0.5);
              opacity: 1;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </Box>
    );
  }

  return null;
}
