"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Homepage';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
  Box,
  Flex,
  rem,
  Center,
} from '@mantine/core';
import MissionCard from '@/components/Information/Mission';
import VisionCard from '@/components/Information/Vision';
import AboutCard from '@/components/Information/About';
import Services from '@/components/Information/Services';
import CustomLoader from "@/components/Loader/CustomLoader";

const AboutPage = () => {
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
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        backgroundImage: 'linear-gradient(to right, #fdecea, #fff)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      {/* Splash Layer */}
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

      {/* Content */}
      <Navbar />
      {/* Use the <Box> instead of Container if you want to fully stretch as in take the whole design maybe good or no? */}
      {/* <Box py="xl" px="md" w="100%" style={{ marginTop: '50px' }}></Box> */}
      <Container size="lg" py="xl" style={{ marginTop: '50px' }}>
        <Flex
          direction="column"
          align="center"
          justify="flex-start"
          style={{ textAlign: 'center' }}
        > 
          <AboutCard />

          <SimpleGrid cols={1} spacing="xl" mt="xl" w="100%">
            <MissionCard />
            <VisionCard />
          </SimpleGrid>

          <Box id="services" w="100%" mt="xl">
            <Services />
          </Box>
        </Flex>
      </Container>

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
};

export default AboutPage;