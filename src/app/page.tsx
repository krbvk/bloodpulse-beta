"use client";

import HomePageCarousel from "@/components/Carousel/Homepage";
import Navbar from "@/components/Navbar/Homepage";
import { useEffect, useState } from "react";

export default function Page() {
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const timeout = setInterval(() => {
      setSplashes((prev) => prev.slice(1)); 
    }, 2000);

    return () => clearInterval(timeout);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSplashes((prev) => [...prev, { id: Date.now(), x, y }]);

    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== splashes[splashes.length - 1]?.id));
    }, 1000);
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }} onClick={handleClick}>
      <div
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
          <div
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
      </div>

      <Navbar />
      <div style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
        <HomePageCarousel />
      </div>

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
    </div>
  );
}
