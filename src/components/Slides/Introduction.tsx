'use client';

import {
  Card,
  Container,
  Text,
  Stack,
  Overlay,
  Button,
  Box,
} from '@mantine/core';
import Link from 'next/link';
import {
  IconDroplet,
  IconClock,
  IconHeartHandshake,
} from '@tabler/icons-react';
import Head from 'next/head';
import { useMediaQuery } from '@mantine/hooks';

export default function Introduction() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Head>
        <link rel="preload" href="/IntroductionImage1.svg" as="image" />
      </Head>

      <Card
        radius="0"
        p={0}
        m={0}
        style={{
          backgroundImage: "url('/IntroductionImage1.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          minHeight: isMobile ? '100vh' : '100vh',
          height: isMobile ? 'calc(100dvh - 56px)' : '100vh',
          width: '100vw',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        <Overlay
          color="#000"
          opacity={0.5}
          zIndex={0}
          style={{ position: 'absolute', inset: 0 }}
        />

        <Container
          size="100%"
          style={{
            marginTop: isMobile ? '1rem' : 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            position: 'relative',
            zIndex: 1,
            padding: isMobile ? '1rem' : '2rem 4rem',
            overflowY: 'auto',
            gap: isMobile ? '2rem' : undefined,
          }}
        >
          {/* Left side */}
          <Stack
            gap="sm"
            style={{
              maxWidth: 600,
              width: '100%',
              textAlign: 'left',
              padding: '2rem',
              borderRadius: '8px',
            }}
          >
            <Text
              size={isMobile ? '34px' : '48px'}
              style={{
                fontWeight: 800,
                color: '#FF4D4D',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              Donate Blood
            </Text>

            <Text
              size={isMobile ? '28px' : '42px'}
              style={{
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              Become a Hero Today
            </Text>

            <Text
              size={isMobile ? 'sm' : 'lg'}
              style={{
                color: '#f1f1f1',
                marginTop: '0.5rem',
                textAlign: 'center',
              }}
            >
              One donation can save countless lives. Together, we bring life to
              those who need it most.
            </Text>

            <Text
              size={isMobile ? 'sm' : 'md'}
              style={{
                color: '#dddddd',
                marginTop: '0.1rem',
                textAlign: 'center',
              }}
            >
              &ldquo;Every drop counts. Be the reason someone gets a second
              chance at life. Step up and be a real-life hero.&rdquo;
            </Text>

            <Button
              component={Link}
              href="/login"
              size={isMobile ? 'md' : 'lg'}
              radius="md"
              color="red"
              mt="md"
              style={{
                marginTop: '2rem',
                width: isMobile ? '100%' : 'fit-content',
                alignSelf: 'center',
              }}
            >
              JOIN US NOW
            </Button>
          </Stack>

          {/* Right side */}
          <Stack
            gap="md"
            style={{
              maxWidth: 500,
              width: '100%',
              color: '#ffffff',
              padding: isMobile ? '1rem' : '2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 77, 77, 0.4)',
              borderRadius: '12px',
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.1)";
            }}
          >
            <Text
              size={isMobile ? 'lg' : 'xl'}
              style={{
                fontWeight: 700,
                color: '#FF4D4D',
                textAlign: 'center',
              }}
            >
              Why It Matters
            </Text>

            <Stack gap="sm" style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', color: '#f0f0f0' }}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconHeartHandshake color="#FF4D4D" />
                <Text>
                  One donation can save up to <strong>three lives</strong>
                </Text>
              </Box>

              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconDroplet color="#FF4D4D" />
                <Text>
                  Someone needs blood every <strong>2 seconds</strong>
                </Text>
              </Box>

              <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconClock color="#FF4D4D" />
                <Text>
                  The process takes just <strong>10 minutes</strong>
                </Text>
              </Box>
            </Stack>

            <Text
              size={isMobile ? 'sm' : 'md'}
              style={{
                fontStyle: 'italic',
                marginTop: '1rem',
                color: '#e0e0e0',
              }}
            >
              &ldquo;I never thought a small act could mean so much — until I
              saw the gratitude in their eyes.&rdquo;
            </Text>
            <Text size={isMobile ? 'xs' : 'sm'} style={{ textAlign: 'right', color: '#aaaaaa' }}>
              — Klyde Cedric D.0
            </Text>
          </Stack>
        </Container>
      </Card>
    </>
  );
}
