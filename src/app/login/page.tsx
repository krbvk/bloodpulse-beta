"use client";

import Navbar from '@/components/Navbar/Homepage';
import Options from '@/components/SignInOptions/Options';
import { Box, Center } from '@mantine/core';
import { useEffect, useState } from 'react';
import CustomLoader from "@/components/Loader/CustomLoader";

export default function LoginPage() {
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

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

  if (loading) {
    return (
    <Center h="100vh">
      <CustomLoader />
    </Center>
    )
  }

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} onClick={handleClick}>
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        {splashes.map((splash) => (
          <Box
            key={splash.id}
            style={{
              position: 'absolute',
              left: splash.x,
              top: splash.y,
              width: '30px',
              height: '30px',
              backgroundColor: 'red',
              borderRadius: '50%',
              opacity: 0.7,
              transform: 'translate(-50%, -50%)',
              animation: 'splash 1s ease-out forwards',
              zIndex: 1001,
            }}
          />
        ))}
      </Box>

      <Navbar />
      <Box
        style={{
          minHeight: '100vh',
          paddingTop: 65,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to right, #fdecea, #fff)',
        }}
      >
        <Options />
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
